import { Injectable } from '@angular/core';
import { GroupCategory } from '@core/domain-classes/group-category';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class GroupCategoryService extends EntityCollectionServiceBase<GroupCategory>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('GroupCategory', serviceElementsFactory);
  }

}
