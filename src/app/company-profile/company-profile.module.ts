import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [CompanyProfileComponent],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class CompanyProfileModule { }
