import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Tax } from '@core/domain-classes/tax';
import { Warehouse } from '@core/domain-classes/warehouse';

import { WarehouseService } from '@core/services/warehouse.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SaleOrderWarehouseResolver implements Resolve<Warehouse[]> {
  /**
   *
   */
  constructor(private warehouseService: WarehouseService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<Warehouse[]> | Promise<Warehouse[]> | Warehouse[] {
    return  this.warehouseService.getAll();
  }
}