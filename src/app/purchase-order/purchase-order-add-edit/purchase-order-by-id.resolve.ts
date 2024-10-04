import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { Tax } from '@core/domain-classes/tax';
import { TaxService } from '@core/services/tax.service';

import { UnitService } from '@core/services/unit.service';
import { Observable } from 'rxjs';
import { PurchaseOrderService } from '../purchase-order.service';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderByIdResolver implements Resolve<PurchaseOrder | null> {
  /**
   *
   */
  constructor(private purchaseOrderService: PurchaseOrderService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<PurchaseOrder> | null  {
    const id = route.paramMap.get('id');
    if (id === 'add') {
        return null;
    }
    return  this.purchaseOrderService.getPurchaseOrderById(id);
  }
}
