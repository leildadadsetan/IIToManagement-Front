import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierResolverService } from './supplier-detail/supplier-detail.resolver';
import { SupplierListComponent } from './supplier-list/supplier-list.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
    data: { claimType: 'SUPP_VIEW_SUPPLIERS' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: SupplierDetailComponent,
    resolve: { supplier: SupplierResolverService },
    data: { claimType: ['SUPP_ADD_SUPPLIER', 'SUPP_UPDATE_SUPPLIER'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
