import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { TaxListComponent } from './tax-list/tax-list.component';

const routes: Routes = [
  {
    path: '',
    component: TaxListComponent,
    data: { claimType: 'PRO_MANAGE_TAX' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
