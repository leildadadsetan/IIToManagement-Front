import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { InquirySourceService } from '@core/services/inquiry-source.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-inquiry-source',
  templateUrl: './manage-inquiry-source.component.html',
  styleUrls: ['./manage-inquiry-source.component.scss']
})
export class ManageInquirySourceComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  inquirySourceForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageInquirySourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InquirySource,
    private inquirySourceService: InquirySourceService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService:TranslationService) {
    super(translationService);
   
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.inquirySourceForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.inquirySourceForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveInquirySource(): void {
    if (!this.inquirySourceForm.valid) {
      this.inquirySourceForm.markAllAsTouched();
      return;
    }
    const inquirySource: InquirySource = this.inquirySourceForm.value;

    if (this.data.id) {
      this.inquirySourceService.update(inquirySource).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('INQUIRY_SOURCE_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.inquirySourceService.add(inquirySource).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('INQUIRY_SOURCE_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
