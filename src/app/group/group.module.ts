import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupListPresentationComponent } from './group-list-presentation/group-list-presentation.component';
import { ManageGroupComponent } from './manage-group/manage-group.component';
import { GroupRoutingModule } from './group-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    GroupListComponent,
    GroupListPresentationComponent,
    ManageGroupComponent
  ],
  imports: [
    CommonModule,
    GroupRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class GroupModule { }
