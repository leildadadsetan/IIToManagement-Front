import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { ReminderRoutingModule } from './reminder-routing.module';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { ReminderDetailResolverService } from './add-reminder/reminder-detail.resolver';
import { ReminderFrequencyPipe } from './reminder-list/reminder-frequency.pipe';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ReminderListComponent,
    AddReminderComponent,
    ReminderFrequencyPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReminderRoutingModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatIconModule
  ],
  providers: [
    ReminderDetailResolverService
  ]
})
export class ReminderModule { }
