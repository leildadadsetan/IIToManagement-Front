import { Injectable } from '@angular/core';
import { Brand } from '@core/domain-classes/brand';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class BrandService extends EntityCollectionServiceBase<Brand>  {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Brand', serviceElementsFactory);
    }

}