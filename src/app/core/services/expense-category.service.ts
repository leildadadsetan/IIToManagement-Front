import { Injectable } from '@angular/core';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class ExpenseCategoryService extends EntityCollectionServiceBase<ExpenseCategory>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('ExpenseCategory', serviceElementsFactory);
  }

}
