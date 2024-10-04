import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { ManageProductCategoryComponent } from './manage-product-category/manage-product-category.component';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ProductCategoryListPresentationComponent } from './product-category-list-presentation/product-category-list-presentation.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    ProductCategoryListComponent,
    ManageProductCategoryComponent,
    ProductCategoryListPresentationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    ProductCategoryRoutingModule
  ]
})
export class ProductCategoryModule { }
