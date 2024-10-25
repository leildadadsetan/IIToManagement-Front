import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageUserGroupComponent } from './manage-user-group/manage-user-group.component';
 import { UserGroupListComponent } from './user-group-list/user-group-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserGroupListComponent,
    data: { claimType: 'UG_VIEW_UG' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage',
    component: ManageUserGroupComponent,
    data: { claimType: 'UG_ADD_UG' },
    canActivate: [AuthGuard]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }
