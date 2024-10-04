import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductsResolver } from '@core/services/products.resolve';
import { PurchaseOrderAddEditComponent } from './purchase-order-add-edit/purchase-order-add-edit.component';
import { PurchaseOrderByIdResolver } from './purchase-order-add-edit/purchase-order-by-id.resolve';
import { PurchaseOrderTaxResolver } from './purchase-order-add-edit/purchase-order-tax.resolve';
import { PurchaseOrderUnitResolver } from './purchase-order-add-edit/purchase-order-unit.resolve';
import { PurchaseOrderWarehouseResolver } from './purchase-order-add-edit/purchase-order-warehouse.resolve';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderListComponent,
    data: { claimType: 'PO_VIEW_PURCHASE_ORDERS' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: PurchaseOrderAddEditComponent,
    data: { claimType: ['PO_ADD_PO', 'PO_UPDATE_PO', 'POR_CONVERT_TO_PO'] },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'warehouses': PurchaseOrderWarehouseResolver,
      'taxs': PurchaseOrderTaxResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'products': ProductsResolver
    }
  },
  {
    path: 'detail/:id',
    component: PurchaseOrderDetailComponent,
    data: { claimType: ['PO_VIEW_PO_DETAIL', 'POR_POR_DETAIL'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
