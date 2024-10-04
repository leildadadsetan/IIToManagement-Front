import { Injectable } from '@angular/core';
import { Page } from '@core/domain-classes/page';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class PageService extends EntityCollectionServiceBase<Page>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Page', serviceElementsFactory);
  }

}
