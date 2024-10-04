import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ProductResolverService } from './manage-product/product-resolver.service';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    data: { claimType: 'PRO_VIEW_PRODUCTS' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: ManageProductComponent,
    data: { claimType: 'PRO_ADD_PRODUCT' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: ManageProductComponent,
    resolve: {
      product: ProductResolverService,
    },
    data: { claimType: 'PRO_UPDATE_PRODUCT' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
