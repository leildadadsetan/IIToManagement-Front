import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitConversationListComponent } from './unit-conversation-list/unit-conversation-list.component';
import { UnitConversationListPresentationComponent } from './unit-conversation-list-presentation/unit-conversation-list-presentation.component';
import { ManageUnitConversationComponent } from './manage-unit-conversation/manage-unit-conversation.component';
import { UnitConversationRoutingModule } from './unit-conversation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    UnitConversationListComponent,
    UnitConversationListPresentationComponent,
    ManageUnitConversationComponent
  ],
  imports: [
    CommonModule,
    UnitConversationRoutingModule, 
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class UnitConversationModule { }
