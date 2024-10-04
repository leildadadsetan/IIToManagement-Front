import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { AddInquiryComponent } from './add-inquiry/add-inquiry.component';
import { AddInquiryResolverService } from './add-inquiry/add-inquiry-resolver.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '@shared/shared.module';
import { InquiryDetailComponent } from './inquiry-detail/inquiry-detail.component';
import { InquiryNoteComponent } from './inquiry-note/inquiry-note.component';
import { InquiryTaskComponent } from './inquiry-task/inquiry-task.component';
import { InquiryTaskAddComponent } from './inquiry-task-add/inquiry-task-add.component';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InquiryAttachmentComponent } from './inquiry-attachment/inquiry-attachment.component';
import { InquiryAttachmentAddComponent } from './inquiry-attachment-add/inquiry-attachment-add.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InquiryProductListComponent } from './inquiry-list/inquiry-product-list/inquiry-product-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    InquiryListComponent,
    AddInquiryComponent,
    InquiryDetailComponent,
    InquiryNoteComponent,
    InquiryTaskComponent,
    InquiryTaskAddComponent,
    InquiryAttachmentComponent,
    InquiryAttachmentAddComponent,
    InquiryProductListComponent
  ],
  imports: [
    CommonModule,
    MatNativeDateModule,
    SharedModule,
    FormsModule,
    InquiryRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    AngularEditorModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  providers: [
    AddInquiryResolverService
  ]
})
export class InquiryModule { }
