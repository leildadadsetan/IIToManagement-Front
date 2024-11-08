import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { ManageUserGroupComponent } from './manage-user-group/manage-user-group.component';
import { UserGroupRoutingModule } from './user-group-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserGroupResolverService } from './manage-user-group/user-group-resolver.service';
import { MatMenuModule } from '@angular/material/menu';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';



@NgModule({
  declarations: [
    UserGroupListComponent,
    ManageUserGroupComponent
  ],
  imports: [
    CommonModule,
    UserGroupRoutingModule,
    MatNativeDateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    UserGroupResolverService
  ]
})
export class UserGroupModule { }
