import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseStockReportComponent } from './warehouse-stock-report.component';
import { WarehouseStockReportRoutingModule } from './warehouse-stock-report-routing.module';
import { WarehouseProductItemsComponent } from './warehouse-product-items/warehouse-product-items.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    WarehouseStockReportComponent,
    WarehouseProductItemsComponent
  ],
  imports: [
    CommonModule,
    WarehouseStockReportRoutingModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class WarehouseStockReportModule { }
