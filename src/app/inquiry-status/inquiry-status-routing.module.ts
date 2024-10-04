import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { InquiryStatusListComponent } from './inquiry-status-list/inquiry-status-list.component';

const routes: Routes = [
  {
    path: '',
    component: InquiryStatusListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'INQ_MANAGE_INQ_STATUS' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryStatusRoutingModule { }
