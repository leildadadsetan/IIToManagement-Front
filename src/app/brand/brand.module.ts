import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandListPresentationComponent } from './brand-list-presentation/brand-list-presentation.component';
import { ManageBrandComponent } from './manage-brand/manage-brand.component';
import { BrandRoutingModule } from './brand-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    BrandListComponent,
    BrandListPresentationComponent,
    ManageBrandComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    MatCardModule,
    MatPaginatorModule,
  ]
})
export class BrandModule { }
