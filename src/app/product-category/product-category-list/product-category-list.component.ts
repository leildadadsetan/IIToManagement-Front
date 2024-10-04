import { Component, OnInit }
  from '@angular/core';
import { ProductCategory } from '@core/domain-classes/product-category';
import { ProductCategoryService } from '@core/services/product-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent extends BaseComponent implements OnInit {
  productCategories$: Observable<ProductCategory[]>;
  constructor(
    private productCategoryService: ProductCategoryService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
   
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.productCategories$ = this.productCategoryService.getAll();
  }

  deleteProductCategory(id: string): void {
    this.productCategoryService.delete(id).subscribe(d => {
      this.toastrService.success(this.translationService.getValue(`CATEGORY_DELETED_SUCCESSFULLY`));
      this.getCategories();
    });
  }

  manageCategory(category: ProductCategory): void {
    this.getCategories();
  }
}
