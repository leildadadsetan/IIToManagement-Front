import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSendComponent } from './email-send.component';
import { EmailSendRoutingModule } from './email-send-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [EmailSendComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    EmailSendRoutingModule,
    AngularEditorModule,
    SharedModule,
    MatProgressSpinnerModule
  ]
})
export class EmailSendModule { }
