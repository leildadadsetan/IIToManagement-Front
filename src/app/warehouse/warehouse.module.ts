import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseListPresentationComponent } from './warehouse-list-presentation/warehouse-list-presentation.component';
import { ManageWarehouseComponent } from './manage-warehouse/manage-warehouse.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    WarehouseListComponent,
    WarehouseListPresentationComponent,
    ManageWarehouseComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    MatPaginatorModule,
  ]
})
export class WarehouseModule { }
