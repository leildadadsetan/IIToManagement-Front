import { NgModule } from '@angular/core';
import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ExpenseCategoryListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'EXP_MANAGE_EXP_CATEGORY' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseCategoryRoutingModule { }
