import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { SalesOrderAddEditComponent } from './sales-order-add-edit/sales-order-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderItemsComponent } from './sales-order-list/sales-order-items/sales-order-items.component';
import { ViewSalesOrderPaymentComponent } from './view-sales-order-payment/view-sales-order-payment.component';
import { AddSalesOrderPaymentComponent } from './add-sales-order-payment/add-sales-order-payment.component';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';



@NgModule({
  declarations: [
    SalesOrderListComponent,
    SalesOrderAddEditComponent,
    SalesOrderItemsComponent,
    ViewSalesOrderPaymentComponent,
    AddSalesOrderPaymentComponent,
    SalesOrderDetailComponent,
    
  ],
  imports: [
    CommonModule,
    SalesOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatDividerModule
  ]
})
export class SalesOrderModule { }
