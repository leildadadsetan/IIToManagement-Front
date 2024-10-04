import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/security/auth.guard";
import { ProductsResolver } from "@core/services/products.resolve";
import { PurchaseOrderByIdResolver } from "../purchase-order/purchase-order-add-edit/purchase-order-by-id.resolve";
import { PurchaseOrderTaxResolver } from "../purchase-order/purchase-order-add-edit/purchase-order-tax.resolve";
import { PurchaseOrderUnitResolver } from "../purchase-order/purchase-order-add-edit/purchase-order-unit.resolve";
import { PurchaseOrderWarehouseResolver } from "../purchase-order/purchase-order-add-edit/purchase-order-warehouse.resolve";
import { PurchaseOrderReturnListComponent } from "./purchase-order-return-list/purchase-order-return-list.component";
import { PurchaseOrderReturnComponent } from "./purchase-order-return/purchase-order-return.component";

const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderReturnListComponent,
    data: { claimType: 'PO_RETURN_PO' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: PurchaseOrderReturnComponent,
    data: { claimType: 'PO_RETURN_PO' },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'warehouses': PurchaseOrderWarehouseResolver,
      'taxs': PurchaseOrderTaxResolver,
      'products': ProductsResolver
    }
  }, {
    path: ':id',
    component: PurchaseOrderReturnComponent,
    data: { claimType: 'PO_RETURN_PO' },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'taxs': PurchaseOrderTaxResolver,
      'warehouses': PurchaseOrderWarehouseResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'products': ProductsResolver
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderReturnRoutingModule { }
