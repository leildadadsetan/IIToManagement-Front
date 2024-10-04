import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ExpenseReportComponent } from './expense-report.component';

const routes: Routes = [
  {
    path:'',
    component:ExpenseReportComponent,
    data: { claimType: 'REP_EXPENSE_REP' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseReportRoutingModule { }
