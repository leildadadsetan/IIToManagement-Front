import { NgModule } from '@angular/core';
import { GroupListComponent } from './group-list/group-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: GroupListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'GR_MANAGE_GROUPS' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
