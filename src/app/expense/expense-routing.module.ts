import { NgModule } from '@angular/core';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { ExpenseResolverService } from './manage-expense/expense-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ExpenseListComponent,
    data: { claimType: 'EXP_VIEW_EXPENSES' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: ManageExpenseComponent,
    data: { claimType: 'EXP_ADD_EXPENSE' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: ManageExpenseComponent,
    resolve: {
      expense: ExpenseResolverService,
    },
    data: { claimType: 'EXP_UPDATE_EXPENSE' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule { }
