import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    data: { claimType: ['DB_STATISTICS', 'DB_BEST_SELLING_PROS', 'DB_REMINDERS', 'DB_LATEST_INQUIRIES', 'DB_RECENT_SO_SHIPMENT', 'DB_RECENT_PO_DELIVERY'] },
    canActivate: [AuthGuard],
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
