import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityListComponent } from './city-list/city-list.component';
import { AuthGuard } from '@core/security/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: CityListComponent,
    data: { claimType: 'SETT_MANAGE_CITY' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
