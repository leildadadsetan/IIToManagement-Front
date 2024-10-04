import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { InquirySourceListComponent } from './inquiry-source-list/inquiry-source-list.component';

const routes: Routes = [
  {
    path: '',
    component: InquirySourceListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'INQ_MANAGE_INQ_SOURCE' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquirySourceRoutingModule { }
