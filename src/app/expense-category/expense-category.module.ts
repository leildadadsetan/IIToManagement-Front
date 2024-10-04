import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';
import { ExpenseCategoryListPresentationComponent } from './expense-category-list-presentation/expense-category-list-presentation.component';
import { ManageExpenseCategoryComponent } from './manage-expense-category/manage-expense-category.component';
import { ExpenseCategoryRoutingModule } from './expense-category-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    ExpenseCategoryListComponent,
    ExpenseCategoryListPresentationComponent,
    ManageExpenseCategoryComponent
  ],
  imports: [
    CommonModule,
    ExpenseCategoryRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class ExpenseCategoryModule { }
