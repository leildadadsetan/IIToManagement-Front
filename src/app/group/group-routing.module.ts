import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupResolverService } from './group-detail/group-detail-resolver.service';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: GroupListComponent,
    data: { claimType: 'GR_VIEW_USERGROUPS' },
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: GroupDetailComponent,
    resolve: {
      group: GroupResolverService
    },
    data: { claimType: ['GR_ADD_GROUP', 'GR_UPDATE_GROUP'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
