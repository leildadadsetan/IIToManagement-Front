import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { SalesOrderAddEditComponent } from './sales-order-add-edit/sales-order-add-edit.component';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesOrderByIdResolver } from './sales-order-add-edit/sales-oredr-by-id-resolve';
import { SalesOrderUnitResolver } from './sales-order-add-edit/sales-order-unit-resolve';
import { SalesOrderTaxResolver } from './sales-order-add-edit/sales-order-tax-resolve';
import { ProductsResolver } from '@core/services/products.resolve';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';
import { SaleOrderWarehouseResolver } from './sales-order-add-edit/sale-order-warehouse.resolve';


const routes: Routes = [
  {
    path: 'list',
    component: SalesOrderListComponent,
    data: { claimType: 'SO_VIEW_SALES_ORDERS' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: SalesOrderAddEditComponent,
    data: { claimType: ['SO_ADD_SO','SO_UPDATE_SO']},
    canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'warehouses':SaleOrderWarehouseResolver,
      'taxs': SalesOrderTaxResolver,
      'salesorder': SalesOrderByIdResolver,
      'products': ProductsResolver
    }
  },
  {
    path: 'detail/:id',
    component: SalesOrderDetailComponent,
    data: { claimType: 'SO_VIEW_SO_DETAIL' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule { }
