import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { Tax } from '@core/domain-classes/tax';
import { TaxService } from '@core/services/tax.service';

import { UnitService } from '@core/services/unit.service';
import { Observable } from 'rxjs';
import { SalesOrderService } from '../sales-order.service';

@Injectable({ providedIn: 'root' })
export class SalesOrderByIdResolver implements Resolve<SalesOrder | null> {
  /**
   *
   */
  constructor(private salesOrderService:SalesOrderService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<SalesOrder> | null  {
    const id = route.paramMap.get('id');
    if (id === 'add') {
        return null;
    }
    return  this.salesOrderService.getSalesOrderById(id);
  }
}
