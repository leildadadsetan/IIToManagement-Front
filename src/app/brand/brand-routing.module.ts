import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { BrandListComponent } from './brand-list/brand-list.component';


const routes: Routes = [
  {
    path: '',
    component: BrandListComponent,
    data: { claimType: 'PRO_MANAGE_BRAND' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
