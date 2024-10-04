import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductPurchaseReportComponent } from './product-purchase-report.component';

const routes: Routes = [
  {
    path:'',
    component: ProductPurchaseReportComponent,
    data: { claimType: 'REP_PRO_PP_REP' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPurchaseReportRoutingModule { }
