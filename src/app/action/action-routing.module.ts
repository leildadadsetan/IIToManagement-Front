import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ActionListComponent } from './action-list/action-list.component';
 
const routes: Routes = [
  {
    path: '',
    component: ActionListComponent,
    data: { claimType: 'ACTIONS_VIEW_ACTIONS' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
