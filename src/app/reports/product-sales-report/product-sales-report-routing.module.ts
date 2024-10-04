import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductSalesReportComponent } from './product-sales-report.component';

const routes: Routes = [
  {
    path:'',
    component: ProductSalesReportComponent,
    data: { claimType: 'REP_PRO_SO_REPORT' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSalesReportRoutingModule { }
