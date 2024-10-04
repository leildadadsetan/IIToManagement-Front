import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquirySourceListComponent } from './inquiry-source-list/inquiry-source-list.component';
import { InquirySourceListPresentationComponent } from './inquiry-source-list-presentation/inquiry-source-list-presentation.component';
import { ManageInquirySourceComponent } from './manage-inquiry-source/manage-inquiry-source.component';
import { InquirySourceRoutingModule } from './inquiry-source-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    InquirySourceListComponent,
    InquirySourceListPresentationComponent,
    ManageInquirySourceComponent],
  imports: [
    CommonModule,
    InquirySourceRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class InquirySourceModule { }
