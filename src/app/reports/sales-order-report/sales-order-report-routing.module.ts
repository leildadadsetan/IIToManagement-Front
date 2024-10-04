import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesOrderReportComponent } from './sales-order-report.component';
const routes: Routes = [
  {
    path:'',
    component: SalesOrderReportComponent,
    data: { claimType: 'REP_SO_REP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderReportRoutingModule { }
