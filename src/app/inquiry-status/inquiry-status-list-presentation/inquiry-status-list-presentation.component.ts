import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageInquiryStatusComponent } from '../manage-inquiry-status/manage-inquiry-status.component';

@Component({
  selector: 'app-inquiry-status-list-presentation',
  templateUrl: './inquiry-status-list-presentation.component.html',
  styleUrls: ['./inquiry-status-list-presentation.component.scss']
})
export class InquiryStatusListPresentationComponent extends BaseComponent implements OnInit {

  @Input() inquiryStatuses: InquiryStatus[];
  @Input() loading: boolean = false;
  @Output() deleteInquiryStatusHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
   
  }

  ngOnInit(): void {
  }

  deleteInquiryStatus(inquiryStatus: InquiryStatus): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${inquiryStatus.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteInquiryStatusHandler.emit(inquiryStatus.id);
        }
      });
  }

  manageInquiryStatus(inquiryStatus: InquiryStatus): void {
    this.dialog.open(ManageInquiryStatusComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, inquiryStatus)
    });
  }
}
