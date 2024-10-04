import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProfitLossReportComponent } from './profit-loss-report.component';


const routes: Routes = [
  {
    path:'',
    component:ProfitLossReportComponent,
    data: { claimType: 'REP_VIEW_PRO_LOSS_REP' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitLossReportRoutingModule { }
