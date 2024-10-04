import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ProductCategory } from '@core/domain-classes/product-category';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends EntityCollectionServiceBase<ProductCategory>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private httpClient: HttpClient) {
    super('ProductCategory', serviceElementsFactory);
  }

  getSubCategories(id: string) {
    const customParams = new HttpParams()
      .set('Id', id)
    const url = `ProductCategories`;
    return this.httpClient.get<ProductCategory[]>(url, {
      params: customParams
    });
  }

  getAllCategoriesForDropDown() {
    const customParams = new HttpParams()
      .set('isDropDown', true)
    const url = `ProductCategories`;
    return this.httpClient.get<ProductCategory[]>(url, {
      params: customParams
    });
  }
}
