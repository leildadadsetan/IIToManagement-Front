import { Injectable } from '@angular/core';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class InquirySourceService extends EntityCollectionServiceBase<InquirySource>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('InquirySource', serviceElementsFactory);
  }

}