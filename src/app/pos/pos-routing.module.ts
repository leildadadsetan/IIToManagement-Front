import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ProductsResolver } from '@core/services/products.resolve';
import { SalesOrderTaxResolver } from '../sales-order/sales-order-add-edit/sales-order-tax-resolve';
import { SalesOrderUnitResolver } from '../sales-order/sales-order-add-edit/sales-order-unit-resolve';
import { PosComponent } from './pos.component';
const routes: Routes = [
  {
    path: '',
    component: PosComponent,
    data: { claimType: ['POS_POS']},
    canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'products': ProductsResolver
    },

  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule { }
