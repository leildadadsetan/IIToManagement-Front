import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductWarehouseReportComponent } from './product-warehouse-report.component';
import { ProductWarehouseReportRoutingModule } from './product-warehouse-report-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { ProductWarehouseItemComponent } from './product-warehouse-item/product-warehouse-item.component';



@NgModule({
  declarations: [
    ProductWarehouseReportComponent,
    ProductWarehouseItemComponent
  ],
  imports: [
    CommonModule,
    ProductWarehouseReportRoutingModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class ProductWarehouseReportModule { }
