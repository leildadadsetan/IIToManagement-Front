import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Tax } from '@core/domain-classes/tax';
import { TaxService } from '@core/services/tax.service';

import { UnitService } from '@core/services/unit.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesOrderTaxResolver implements Resolve<Tax[]> {
  /**
   *
   */
  constructor(private taxService: TaxService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Tax[]> | Promise<Tax[]> | Tax[] {
    return  this.taxService.getAll();
  }
}
