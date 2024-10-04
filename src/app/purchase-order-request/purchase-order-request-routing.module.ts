import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductsResolver } from '@core/services/products.resolve';
import { PurchaseOrderByIdResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-by-id.resolve';
import { PurchaseOrderTaxResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-tax.resolve';
import { PurchaseOrderUnitResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-unit.resolve';
import { PurchaseOrderWarehouseResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-warehouse.resolve';
import { PurchaseOrderRequestAddEditComponent } from './purchase-order-request-add-edit/purchase-order-request-add-edit.component';
import { PurchaseOrderRequestListComponent } from './purchase-order-request-list/purchase-order-request-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderRequestListComponent,
    data: { claimType: 'POR_VIEW_PO_REQUESTS' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: PurchaseOrderRequestAddEditComponent,
    data: { claimType: ['POR_ADD_PO_REQUEST', 'POR_UPDATE_PO_REQUEST'] },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'warehouses': PurchaseOrderWarehouseResolver,
      'taxs': PurchaseOrderTaxResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'products': ProductsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRequestRoutingModule { }
