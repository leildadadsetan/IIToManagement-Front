import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerPaymentReportComponent } from './customer-payment-report.component';
import { AuthGuard } from '@core/security/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentReportComponent,
    data: { claimType: 'REP_CUST_PAYMENT_REP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPaymentReportRoutingModule { }

