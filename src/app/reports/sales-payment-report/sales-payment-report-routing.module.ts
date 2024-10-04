import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesPaymentReportComponent } from './sales-payment-report.component';

const routes: Routes = [
  {
    path:'',
    component: SalesPaymentReportComponent,
    data: { claimType: 'REP_SO_PAYMENT_REP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPaymentReportRoutingModule { }
