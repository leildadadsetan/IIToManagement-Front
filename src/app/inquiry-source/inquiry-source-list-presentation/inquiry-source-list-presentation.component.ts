import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageInquirySourceComponent } from '../manage-inquiry-source/manage-inquiry-source.component';

@Component({
  selector: 'app-inquiry-source-list-presentation',
  templateUrl: './inquiry-source-list-presentation.component.html',
  styleUrls: ['./inquiry-source-list-presentation.component.scss']
})
export class InquirySourceListPresentationComponent extends BaseComponent implements OnInit {

  @Input() inquirySources: InquirySource[];
  @Input() loading: boolean = false;
  @Output() deleteInquirySourceHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  deleteInquirySource(inquirySource: InquirySource): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${inquirySource.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteInquirySourceHandler.emit(inquirySource.id);
        }
      });
  }

  manageInquirySource(inquirySource: InquirySource): void {
    this.dialog.open(ManageInquirySourceComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, inquirySource)
    });
  }
}
