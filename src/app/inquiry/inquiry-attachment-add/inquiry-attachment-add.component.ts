import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@environments/environment'
import { InquiryAttachment } from '@core/domain-classes/inquiry-attachment';
import { InquiryAttachmentService } from '../inquiry-attachment/inquiry-attachment.service';
import { BaseComponent } from 'src/app/base.component';
import { InquiryAttachmentDialog } from '@core/domain-classes/inquiry-attachment-dialog';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-inquiry-attachment-add',
  templateUrl: './inquiry-attachment-add.component.html',
  styleUrls: ['./inquiry-attachment-add.component.scss']
})
export class InquiryAttachmentAddComponent extends BaseComponent implements OnInit {

  inquiryDocumentForm: UntypedFormGroup;
  documentForm: string = '';
  _validFileExtensions = environment.allowFileExtension;
  extension: string = '';
  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: InquiryAttachmentDialog,
    public dialogRef: MatDialogRef<InquiryAttachmentAddComponent>,
    private toastrService: ToastrService,
    private inquiryAttachmentService: InquiryAttachmentService,
    public translationService:TranslationService ) {
    super(translationService);
  
  }

  ngOnInit(): void {
    this.createInquiryDocumentForm();
  }

  createInquiryDocumentForm() {
    this.inquiryDocumentForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  fileEvent($event) {
    let files: File[] = $event.target.files;
    if (files.length == 0) {
      return;
    }
    const file = files[0];
    this.extension = file.name.split('.').pop();
    if (this.Validate(file.name)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.documentForm = reader.result.toString();
      }
    }
  }

  buildInquiryDocumentForm() {
    const inquiryAttachment: InquiryAttachment = {
      inquiryId: this.data.inquiryId,
      documents: this.documentForm,
      name: this.inquiryDocumentForm.get('name').value,
      extension: this.extension
    };
    return inquiryAttachment;
  }

  onAttachmentSubmit() {
    if (!this.inquiryDocumentForm.valid) {
      this.toastrService.error(this.translationService.getValue('PLEASE_ENTER_NAME_OF_DOCUMENT'));
      this.inquiryDocumentForm.markAllAsTouched();
      return;
    }
    if (!this.documentForm) {
      this.toastrService.error(this.translationService.getValue('PLEASE_UPLOAD_DOCUMENT'));
      return;
    }
    const inquiryAttachment = this.buildInquiryDocumentForm();
    this.sub$.sink = this.inquiryAttachmentService.saveInquiryAttachment(inquiryAttachment)
      .subscribe(c => {
        this.toastrService.success(this.translationService.getValue('DOCUMENT_SAVE_SUCCESSFULLY'));
        this.dialogRef.close();
      });
  }


  Validate(fileName: string) {
    var sFileName = fileName;
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < this._validFileExtensions.length; j++) {
        var sCurExtension = this._validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        this.toastrService.error(sFileName + this.translationService.getValue('IS_INVALID_ALLOWED_EXTENSIONS_ARE') + this._validFileExtensions.join(", "));
        return false;
      }
    }
    return true;
  }

  onInquiryList() {
    this.dialogRef.close();
  }

}
