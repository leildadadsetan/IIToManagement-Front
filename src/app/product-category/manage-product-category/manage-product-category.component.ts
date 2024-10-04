import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategory } from '@core/domain-classes/product-category';
import { ProductCategoryService } from '@core/services/product-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-product-category',
  templateUrl: './manage-product-category.component.html',
  styleUrls: ['./manage-product-category.component.scss']
})
export class ManageProductCategoryComponent extends BaseComponent implements OnChanges {
  isEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManageProductCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductCategory,
    private productCategoryService: ProductCategoryService,
    public translationService:TranslationService,
    private toastrService: ToastrService) {
    super(translationService);
   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data.id) {
        this.isEdit = true;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveCategory(): void {
    if (this.data.id) {
      this.productCategoryService.update(this.data).subscribe(c => {
        this.toastrService.success('Product Category Saved Successfully.');
        this.dialogRef.close(this.data);
      });
    } else {
      this.productCategoryService.add(this.data).subscribe(c => {
        this.toastrService.success('Product Category Saved Successfully.');
        this.dialogRef.close(this.data);
      });
    }
  }
}

