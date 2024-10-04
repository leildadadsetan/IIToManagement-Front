import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Supplier } from '@core/domain-classes/supplier';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

import { SupplierService } from '../supplier.service';


@Injectable()
export class SupplierResolverService implements Resolve<Supplier> {
  constructor(private supplierService: SupplierService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Supplier> | null {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      return null;
    }
    return this.supplierService.getSupplier(id).pipe(
      take(1),
      mergeMap(supplier => {
        if (supplier) {
          return of(supplier);
        } else {
          this.router.navigate(['/supplier']);
          return null;
        }
      })
    );
  }
}
