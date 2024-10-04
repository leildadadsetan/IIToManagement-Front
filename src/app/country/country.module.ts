import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryListPresentationComponent } from './country-list-presentation/country-list-presentation.component';
import { ManageCountryComponent } from './manage-country/manage-country.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CountryRoutingModule } from './country-routing.module';



@NgModule({
  declarations: [
    CountryListComponent,
    CountryListPresentationComponent,
    ManageCountryComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    MatCardModule,
    MatPaginatorModule,
  ]
})
export class CountryModule { }
