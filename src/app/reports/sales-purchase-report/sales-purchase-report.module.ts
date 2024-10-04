import { NgModule } from '@angular/core';
import { SalesPurchaseReportComponent } from './sales-purchase-report.component';
import { SalesPurchaseRoutingModule } from './sales-purchase-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ChartsModule  } from 'ng2-charts';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    SalesPurchaseReportComponent
  ],
  imports: [
    SalesPurchaseRoutingModule,
    FormsModule,
    SharedModule,
    ChartsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [UTCToLocalTime]
})
export class SalesPurchaseReportModule { }
