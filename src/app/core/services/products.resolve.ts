import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../product/product.service';

@Injectable({ providedIn: 'root' })
export class ProductsResolver implements Resolve<Product[] | null> {
  /**
   *
   */
  constructor(private productService: ProductService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Product[]> | null  {
    const productResource= new ProductResourceParameter();
    return  this.productService.getProducts(productResource)
    .pipe(
      map((resp: HttpResponse<Product[]>) =>resp.body )
    )

  }
}
