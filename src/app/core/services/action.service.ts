import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Action } from '@core/domain-classes/action';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ActionService extends EntityCollectionServiceBase<Action>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, private httpClient: HttpClient) {
    super('Action', serviceElementsFactory);
  }

  getActionByPage(id: string) {
   return this.getAll().pipe(
      map(response => {
        return response.filter(c => c.pageId == id);
      })
    )
  }

}
