import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Tax } from '@core/domain-classes/tax';

@Injectable({providedIn: 'root'})
export class TaxService extends EntityCollectionServiceBase<Tax>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('Tax', serviceElementsFactory);
  }

}
