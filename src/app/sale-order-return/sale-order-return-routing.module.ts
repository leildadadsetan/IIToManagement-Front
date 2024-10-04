import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductsResolver } from '@core/services/products.resolve';
import { SaleOrderWarehouseResolver } from '../sales-order/sales-order-add-edit/sale-order-warehouse.resolve';
import { SalesOrderTaxResolver } from '../sales-order/sales-order-add-edit/sales-order-tax-resolve';
import { SalesOrderUnitResolver } from '../sales-order/sales-order-add-edit/sales-order-unit-resolve';
import { SalesOrderByIdResolver } from '../sales-order/sales-order-add-edit/sales-oredr-by-id-resolve';
import { SaleOrderReturnListComponent } from './sale-order-return-list/sale-order-return-list.component';
import { SaleOrderReturnComponent } from './sale-order-return/sale-order-return.component';

const routes: Routes = [
  {
    path: 'list',
    component: SaleOrderReturnListComponent,
    data: { claimType: 'SO_RETURN_SO' },
    canActivate: [AuthGuard]
  },{
    path: 'add',
    component: SaleOrderReturnComponent,
    data: { claimType: 'SO_RETURN_SO' },
    canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'warehouses':SaleOrderWarehouseResolver,
      'products': ProductsResolver
    }
  },{
    path: ':id',
    component: SaleOrderReturnComponent,
    data: { claimType: 'SO_RETURN_SO' },
    canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'warehouses':SaleOrderWarehouseResolver,
      'salesorder': SalesOrderByIdResolver,
      'products': ProductsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleOrderReturnRoutingModule { }
