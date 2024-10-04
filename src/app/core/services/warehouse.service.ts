import { Injectable } from '@angular/core';
import { Warehouse } from '@core/domain-classes/warehouse';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends EntityCollectionServiceBase<Warehouse>  {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Warehouse', serviceElementsFactory);
    }

}