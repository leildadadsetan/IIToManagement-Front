import { NgModule } from '@angular/core';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: WarehouseListComponent,
    data: { claimType: 'PRO_MANAGE_WAREHOUSE' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
