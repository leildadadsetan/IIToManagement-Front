import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { InquiryStatusService } from '@core/services/inquiry-status.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-inquiry-status',
  templateUrl: './manage-inquiry-status.component.html',
  styleUrls: ['./manage-inquiry-status.component.scss']
})
export class ManageInquiryStatusComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  inquiryStatusForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageInquiryStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InquiryStatus,
    private inquiryStatusService: InquiryStatusService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
    
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.inquiryStatusForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.inquiryStatusForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveInquiryStatus(): void {
    if (!this.inquiryStatusForm.valid) {
      this.inquiryStatusForm.markAllAsTouched();
      return;
    }
    const inquiryStatus: InquiryStatus = this.inquiryStatusForm.value;

    if (this.data.id) {
      this.inquiryStatusService.update(inquiryStatus).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('INQUIRY_STATUS_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.inquiryStatusService.add(inquiryStatus).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('INQUIRY_STATUS_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}

