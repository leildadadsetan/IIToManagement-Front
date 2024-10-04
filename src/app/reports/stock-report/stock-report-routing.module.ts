import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { StockReportComponent } from './stock-report.component';

const routes: Routes = [
  {
    path:'',
    component: StockReportComponent,
    data: { claimType: 'REP_STOCK_REPORT' },
    canActivate: [AuthGuard],
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockReportRoutingModule { }
