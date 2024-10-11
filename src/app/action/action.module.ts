import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionRoutingModule } from './action-routing.module';
import { ActionListComponent } from './action-list/action-list.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActionDetailResolverService } from './action-detail.resolver';
 import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '@shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ActionListComponent],
  imports: [
    CommonModule,
    ActionRoutingModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    DragDropModule,
    SharedModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [ActionDetailResolverService]
})
export class ActionModule { }
