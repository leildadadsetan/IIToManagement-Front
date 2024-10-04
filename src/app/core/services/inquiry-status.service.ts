import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';

@Injectable({providedIn: 'root'})
export class InquiryStatusService extends EntityCollectionServiceBase<InquiryStatus>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('InquiryStatus', serviceElementsFactory);
  }

}
