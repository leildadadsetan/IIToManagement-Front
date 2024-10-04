import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplateManageComponent } from './email-template-manage/email-template-manage.component';
import { EmailTemplateListComponent } from './email-template-list/email-template-list.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    EmailTemplateManageComponent,
    EmailTemplateListComponent],
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    AngularEditorModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule
  ]
})
export class EmailTemplateModule { }
