import { Injectable } from '@angular/core';
import { Group } from '@core/domain-classes/group';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class GroupService extends EntityCollectionServiceBase<Group>  {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Group', serviceElementsFactory);
    }

}