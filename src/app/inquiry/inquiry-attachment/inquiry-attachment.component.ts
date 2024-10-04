import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { InquiryAttachment } from '@core/domain-classes/inquiry-attachment';
import { InquiryAttachmentDialog } from '@core/domain-classes/inquiry-attachment-dialog';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { InquiryAttachmentAddComponent } from '../inquiry-attachment-add/inquiry-attachment-add.component';
import { InquiryAttachmentService } from './inquiry-attachment.service';

@Component({
  selector: 'app-inquiry-attachment',
  templateUrl: './inquiry-attachment.component.html',
  styleUrls: ['./inquiry-attachment.component.scss']
})
export class InquiryAttachmentComponent extends BaseComponent implements OnInit {

  @Input() inquiryId: string;
  inquiryAttachments: InquiryAttachment[] = [];
  constructor(
    private inquiryAttachmentService: InquiryAttachmentService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    super(translationService);
  
  }

  ngOnInit(): void {
    this.getInquiryAttachments();
  }

  getInquiryAttachments() {
    this.sub$.sink = this.inquiryAttachmentService.getInquiryAttachments(this.inquiryId)
      .subscribe(c => {
        this.inquiryAttachments = c;
      });
  }
  onDownload(inquiryAttachment: InquiryAttachment) {
    this.sub$.sink = this.inquiryAttachmentService.downloadFile(inquiryAttachment.id)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.downloadFile(event, inquiryAttachment.name);
          }
        },
        (error) => {
          this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
        }
      );
  }

  private downloadFile(data: HttpResponse<Blob>, name: string) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }


  onDeleted(inquiryAttachment: InquiryAttachment) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.inquiryAttachmentService.deleteInquiryAttachment(inquiryAttachment.id)
            .subscribe(c => {
              if (c) {
                this.toastrService.success(this.translationService.getValue('INQUIRY_ATTACHMENT_DELETED'));
                this.getInquiryAttachments();
              }
            });
        }
      });
  }
  onAddInquiryAttachement() {
    const inquiryAttachmentDialog: InquiryAttachmentDialog = {
      inquiryId: this.inquiryId,
      inquiryAttachment: null
    };
    const dialogRef = this.dialog.open(InquiryAttachmentAddComponent, {
      width: '600px',
      direction:this.langDir,
      data: inquiryAttachmentDialog
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe(result => {
        this.getInquiryAttachments();
      });
  }

}
