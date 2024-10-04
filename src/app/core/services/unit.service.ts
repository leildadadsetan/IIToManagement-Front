import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Unit } from '@core/domain-classes/unit';

@Injectable({providedIn: 'root'})
export class UnitService extends EntityCollectionServiceBase<Unit>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('Unit', serviceElementsFactory);
  }

}
