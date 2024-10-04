import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxListComponent } from './tax-list/tax-list.component';
import { TaxListPresentationComponent } from './tax-list-presentation/tax-list-presentation.component';
import { ManageTaxComponent } from './manage-tax/manage-tax.component';
import { TaxRoutingModule } from './tax-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    TaxListComponent,
    TaxListPresentationComponent,
    ManageTaxComponent
  ],
  imports: [
    CommonModule,
    TaxRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class TaxModule { }
