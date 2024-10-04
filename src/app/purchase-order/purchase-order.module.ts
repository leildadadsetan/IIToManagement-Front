import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderAddEditComponent } from './purchase-order-add-edit/purchase-order-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { SharedModule } from '@shared/shared.module';
import {MatDividerModule} from '@angular/material/divider';
import { PurchaseOrderItemComponent } from './purchase-order-item/purchase-order-item.component';
import { AddPurchaseOrderPaymentsComponent } from './add-purchase-order-payments/add-purchase-order-payments.component'
import {  MatDialogModule } from '@angular/material/dialog';
import { ViewPurchaseOrderPaymentComponent } from './view-purchase-order-payment/view-purchase-order-payment.component';


@NgModule({
  declarations: [
    PurchaseOrderAddEditComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailComponent,
    PurchaseOrderItemComponent,
    AddPurchaseOrderPaymentsComponent,
    ViewPurchaseOrderPaymentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PurchaseOrderRoutingModule,
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
    MatDividerModule,
    MatDialogModule

  ]
})
export class PurchaseOrderModule { }
