import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierPaymentsComponent } from './supplier-payments.component';
import { SupplierPaymentsRoutingModule } from './supplier-payments-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    SupplierPaymentsComponent
  ],
  imports: [
    CommonModule,
    SupplierPaymentsRoutingModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class SupplierPaymentsModule { }
