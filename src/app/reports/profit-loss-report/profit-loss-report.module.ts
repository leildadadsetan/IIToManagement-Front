import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitLossReportComponent } from './profit-loss-report.component';
import { ProfitLossReportRoutingModule } from './profit-loss-report-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    ProfitLossReportComponent
  ],
  imports: [
    CommonModule,
    ProfitLossReportRoutingModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,

    MatMenuModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    MatNativeDateModule,
    

    MatFormFieldModule,
    MatInputModule,
    
    MatSelectModule,
    MatPaginatorModule,
 
  ]
})
export class ProfitLossReportModule { }
