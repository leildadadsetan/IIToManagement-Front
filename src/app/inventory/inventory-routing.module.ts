import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { InventoryListComponent } from './inventory-list/inventory-list.component';


const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent,
    data: { claimType: 'INVE_VIEW_INVENTORIES' },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
