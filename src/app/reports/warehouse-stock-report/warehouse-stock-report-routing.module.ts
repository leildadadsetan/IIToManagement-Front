import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { WarehouseStockReportComponent } from './warehouse-stock-report.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseStockReportComponent,
    data: { claimType: 'REP_VIEW_WAR_REP' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseStockReportRoutingModule {}
