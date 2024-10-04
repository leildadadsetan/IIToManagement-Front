import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductShort } from '@core/domain-classes/productshort';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductWarehouseReportService {
  constructor(private http: HttpClient) {}

  getWarehouseProduct(): Observable<ProductShort[]> {
    const url = 'product/bywarehouse';
    return this.http.get<ProductShort[]>(url);
  }

  getProductWarehouse(productId: string): Observable<ProductShort[]> {
    const url = `warehouse/product/${productId}`;
    return this.http.get<ProductShort[]>(url);
  }
}
