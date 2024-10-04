import { Injectable } from '@angular/core';
import { Country } from '@core/domain-classes/country';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class CountryService extends EntityCollectionServiceBase<Country>  {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Country', serviceElementsFactory);
    }

}