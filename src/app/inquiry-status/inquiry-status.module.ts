import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryStatusListComponent } from './inquiry-status-list/inquiry-status-list.component';
import { InquiryStatusListPresentationComponent } from './inquiry-status-list-presentation/inquiry-status-list-presentation.component';
import { ManageInquiryStatusComponent } from './manage-inquiry-status/manage-inquiry-status.component';
import { InquiryStatusRoutingModule } from './inquiry-status-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    InquiryStatusListComponent,
    InquiryStatusListPresentationComponent,
    ManageInquiryStatusComponent
  ],
  imports: [
    CommonModule,
    InquiryStatusRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class InquiryStatusModule { }
