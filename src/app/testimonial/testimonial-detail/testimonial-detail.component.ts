import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Testimonial } from '@core/domain-classes/testimonial';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { TestimonialService } from '../testimonial.service';

@Component({
  selector: 'app-testimonial-detail',
  templateUrl: './testimonial-detail.component.html',
  styleUrls: ['./testimonial-detail.component.scss']
})
export class TestimonialDetailComponent extends BaseComponent implements OnInit {
  testimonialForm: UntypedFormGroup;
  testimonial: Testimonial;
  isLoading = false;
  editorConfig = EditorConfig;
  isImageUpload = false;
  imgSrc: string | ArrayBuffer;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private testimonialService: TestimonialService,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private router: Router) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createTestimonialForm();
    const routeSub$ = this.route.data.subscribe(
      (data: { testimonial: Testimonial }) => {
        if (data.testimonial) {
          this.testimonial = data.testimonial;
          this.patchTestimonial();
        } else {
        }
      }
    );
    this.sub$.add(routeSub$);
  }

  patchTestimonial() {
    this.testimonialForm.patchValue({
      name: this.testimonial.name,
      designation: this.testimonial.designation,
      message: this.testimonial.message,
      isActive: this.testimonial.isActive
    });
    if (this.testimonial.url) {
      this.imgSrc = `${environment.apiUrl}${this.testimonial.url}`;
    }
  }

  createTestimonialForm() {
    this.testimonialForm = this.fb.group({
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      message: ['', Validators.required],
      isActive: [true],
      profileImage: ['']
    });
  }

  onTestimonialSubmit() {
    if (this.testimonialForm.valid) {
      const testimonial: Testimonial = Object.assign(this.testimonialForm.value, {
        imageSrc: this.imgSrc,
        isImageUpload: this.isImageUpload
      });
      if (this.testimonial) {
        this.testimonialService.updateTestimonial(this.testimonial.id, testimonial).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('TESTIMONIAL_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/testimonial']);
        });
      } else {
        this.testimonialService.saveTestimonial(testimonial).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('TESTIMONIAL_ADDED_SUCCESSFULLY'));
          this.router.navigate(['/testimonial']);
        });
      }
    } else {
      this.testimonialForm.markAllAsTouched();
    }
  }

  onFileSelect($event) {
    const fileSelected = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.isImageUpload = true;
      $event.target.value = '';
    }
  }

  onRemoveImage() {
    this.imgSrc = '';
    this.isImageUpload = true;
  }
}

