import { NgModule } from '@angular/core';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AddInquiryComponent } from './add-inquiry/add-inquiry.component';
import { AddInquiryResolverService } from './add-inquiry/add-inquiry-resolver.service';
import { InquiryDetailComponent } from './inquiry-detail/inquiry-detail.component';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: InquiryListComponent,
    data: { claimType: 'INQ_VIEW_INQUIRIES' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: AddInquiryComponent,
    data: { claimType: 'INQ_ADD_INQUIRY' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: InquiryDetailComponent,
    resolve: {
      inquiry: AddInquiryResolverService,
    },
    data: { claimType: 'INQ_UPDATE_INQUIRY' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRoutingModule { }
