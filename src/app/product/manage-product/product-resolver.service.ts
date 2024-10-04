import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Product } from '@core/domain-classes/product';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ProductService } from '../product.service';


@Injectable()
export class ProductResolverService implements Resolve<Product> {
    constructor(
        private productService: ProductService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Product> | null {
        const id = route.paramMap.get('id');
        if (id === 'add') {
            return null;
        }
        return this.productService.getProudct(id).pipe(
            take(1),
            mergeMap((expense) => {
                if (expense) {
                    return of(expense);
                } else {
                    this.router.navigate(['/products']);
                    return null;
                }
            })
        );
    }
}
