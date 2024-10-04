import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPaymentReportComponent } from './customer-payment-report.component';
import { CustomerPaymentReportRoutingModule } from './customer-payment-report-routing.module';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    CustomerPaymentReportComponent
  ],
  imports: [
    CommonModule,
    CustomerPaymentReportRoutingModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class CustomerPaymentReportModule { }
