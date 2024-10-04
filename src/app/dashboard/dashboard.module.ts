import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalenderViewComponent } from './calender-view/calender-view.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { BestSellingProductComponent } from './best-selling-product/best-selling-product.component';
import { LatestInquiryComponent } from './latest-inquiry/latest-inquiry.component';
import { SalesOrderExpectedShipmentComponent } from './sales-order-expected-shipment/sales-order-expected-shipment.component';
import { PurchaseOrderExpectedDeliveryComponent } from './purchase-order-expected-delivery/purchase-order-expected-delivery.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [DashboardComponent,
    CalenderViewComponent,
    BestSellingProductComponent,
    LatestInquiryComponent,
    SalesOrderExpectedShipmentComponent,
    PurchaseOrderExpectedDeliveryComponent,
    StatisticsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SharedModule,
    ChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ]
})
export class DashboardModule { }
