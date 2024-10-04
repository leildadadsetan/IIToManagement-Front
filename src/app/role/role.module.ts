import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageRolePresentationComponent } from './manage-role-presentation/manage-role-presentation.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoleDetailResolverService } from './role-detail.resolver';
import { RoleUsersComponent } from './role-users/role-users.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '@shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    RoleListComponent,
    ManageRoleComponent,
    ManageRolePresentationComponent,
    RoleUsersComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
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
  providers: [RoleDetailResolverService]
})
export class RoleModule { }
