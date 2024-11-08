import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupCategoryListComponent } from './group-category-list/group-category-list.component';
import { GroupCategoryListPresentationComponent } from './group-category-list-presentation/group-category-list-presentation.component';
import { ManageGroupCategoryComponent } from './manage-group-category/manage-group-category.component';
import { GroupCategoryRoutingModule } from './group-category-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    GroupCategoryListComponent,
    GroupCategoryListPresentationComponent,
    ManageGroupCategoryComponent
  ],
  imports: [
    CommonModule,
    GroupCategoryRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class GroupCategoryModule { }
