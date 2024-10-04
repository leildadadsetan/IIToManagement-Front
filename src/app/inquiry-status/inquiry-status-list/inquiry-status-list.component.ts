import { Component, OnInit } from '@angular/core';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { InquiryStatusService } from '@core/services/inquiry-status.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-inquiry-status-list',
  templateUrl: './inquiry-status-list.component.html',
  styleUrls: ['./inquiry-status-list.component.scss']
})
export class InquiryStatusListComponent extends BaseComponent implements OnInit {
  inquiryStatuses$: Observable<InquiryStatus[]>;
  loading$: Observable<boolean>;
  constructor(
    private inquiryStatusService: InquiryStatusService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
   
  }
  ngOnInit(): void {

    this.loading$ = this.inquiryStatusService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getInquiryStatuses();
          }
        })
      )
    this.inquiryStatuses$ = this.inquiryStatusService.entities$
  }

  getInquiryStatuses(): void {
    this.inquiryStatusService.getAll();
  }

  deleteInquiryStatus(id: string): void {
    this.sub$.sink = this.inquiryStatusService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('INQUIRY_STATUS_DELETED_SUCCESSFULLY'));
    });
  }
  // manageInquiryStatus(inquiryStatus: InquiryStatus): void {
  //   if (inquiryStatus.id) {
  //     this.sub$.sink = this.inquiryStatusService.update(inquiryStatus).subscribe(() => {
  //       this.toastrService.success(`Inquiry Status Updated Successfully.`);
  //     });
  //   } else {
  //     this.sub$.sink = this.inquiryStatusService.add(inquiryStatus).subscribe(() => {
  //       this.toastrService.success(`Inquiry Status Saved Successfully.`);
  //     });
  //   }

  // }
}
