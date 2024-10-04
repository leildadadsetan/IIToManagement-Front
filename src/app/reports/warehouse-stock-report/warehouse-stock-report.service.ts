import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Warehouse } from '@core/domain-classes/warehouse';
import { WarehouseInventory } from '@core/domain-classes/warehouseInventory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WarehouseStockReportService {
  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    const url = 'warehouses';
    return this.http.get<Warehouse[]>(url);
  }

  getWarehouseProduct(warehouseId: string): Observable<WarehouseInventory[]> {
    const url = `warehouse/${warehouseId}/items`;
    return this.http.get<WarehouseInventory[]>(url);
  }

}
