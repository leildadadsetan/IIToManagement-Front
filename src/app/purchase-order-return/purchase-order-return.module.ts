import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderReturnComponent } from './purchase-order-return/purchase-order-return.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseOrderRoutingModule } from '../purchase-order/purchase-order-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { PurchaseOrderReturnRoutingModule } from './purchase-order-return-routing.module';
import { PurchaseOrderReturnListComponent } from './purchase-order-return-list/purchase-order-return-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PurchaseOrderReturnItemComponent } from './purchase-order-return-item/purchase-order-return-item.component';



@NgModule({
  declarations: [
    PurchaseOrderReturnComponent,
    PurchaseOrderReturnListComponent,
    PurchaseOrderReturnItemComponent
  ],
  imports: [
    CommonModule,
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
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    PurchaseOrderReturnRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

  ]
})
export class PurchaseOrderReturnModule { }
