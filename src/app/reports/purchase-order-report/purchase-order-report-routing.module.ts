import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { PurchaseOrderReportComponent } from './purchase-order-report.component';

const routes: Routes = [
  {
    path:'',
    component: PurchaseOrderReportComponent,
    data: { claimType: 'REP_PO_REP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderReportRoutingModule { }
