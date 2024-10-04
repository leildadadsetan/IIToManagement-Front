import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { TestimonialDetailComponent } from './testimonial-detail/testimonial-detail.component';
import { TestimonialDetailResolverService } from './testimonial-detail/testimonial-detail-resolver.service';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TestimonialListComponent,
    data: { claimType: 'testimonial_view_testimonials' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: TestimonialDetailComponent,
    resolve: {
      testimonial: TestimonialDetailResolverService,
    },
    data: { claimType: ['testimonial_add_testimonial', 'testimonial_update_testimonial'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestimonialRoutingModule { }
