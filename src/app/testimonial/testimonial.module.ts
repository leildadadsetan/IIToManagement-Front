import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { TestimonialDetailComponent } from './testimonial-detail/testimonial-detail.component';
import { TestimonialDetailResolverService } from './testimonial-detail/testimonial-detail-resolver.service';
import { SharedModule } from '@shared/shared.module';
import { TestimonialRoutingModule } from './testimonial-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [TestimonialListComponent, TestimonialDetailComponent],
  imports: [
    CommonModule,
    TestimonialRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AngularEditorModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  providers: [TestimonialDetailResolverService]
})
export class TestimonialModule { }
