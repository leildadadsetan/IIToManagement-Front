import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
  {
    path:'',
    component: ContactUsComponent,
    data: { claimType: 'contact_requests_view_contact_requests' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule { }
