import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SalesPurchaseReportComponent } from './sales-purchase-report.component';
import { AuthGuard } from '@core/security/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: SalesPurchaseReportComponent,
    data: { claimType: 'REP_SALES_VS_PURCHASE_REP' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPurchaseRoutingModule { }