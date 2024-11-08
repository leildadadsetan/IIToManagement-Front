import { NgModule } from '@angular/core';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserGroupComponent } from './manage-user-group/manage-user-group.component';
import { UserGroupResolverService } from './manage-user-group/user-group-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: UserGroupListComponent,
    data: { claimType: 'GR_VIEW_USERGROUPS' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: ManageUserGroupComponent,
    data: { claimType: 'GR_ADD_GROUP' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: ManageUserGroupComponent,
    resolve: {
      group: UserGroupResolverService,
    },
    data: { claimType: 'GR_UPDATE_GROUP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupRoutingModule { }
