import { Injectable } from '@angular/core';
import { Category } from '@core/domain-classes/category';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class CategoryService extends EntityCollectionServiceBase<Category>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Category', serviceElementsFactory);
  }

}
