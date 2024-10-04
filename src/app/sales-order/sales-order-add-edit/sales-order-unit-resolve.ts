import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Unit } from '@core/domain-classes/unit';
import { Observable } from 'rxjs';
import { UnitConversationService } from 'src/app/unit-conversation/unit-conversation.service';

@Injectable({ providedIn: 'root' })
export class SalesOrderUnitResolver implements Resolve<Unit[]> {
  /**
   *
   */
   constructor(private unitConversationService: UnitConversationService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Unit[]> | Promise<Unit[]> | Unit[] {
    return  this.unitConversationService.getUnitConversations();
  }
}
