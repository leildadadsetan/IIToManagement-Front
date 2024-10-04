import { Component, OnInit } from '@angular/core';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { InquirySourceService } from '@core/services/inquiry-source.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-inquiry-source-list',
  templateUrl: './inquiry-source-list.component.html',
  styleUrls: ['./inquiry-source-list.component.scss']
})
export class InquirySourceListComponent extends BaseComponent implements OnInit {
  inquirySources$: Observable<InquirySource[]>;
  loading$: Observable<boolean>;
  constructor(
    private inquirySourcesService: InquirySourceService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
    
  }
  ngOnInit(): void {

    this.loading$ = this.inquirySourcesService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getInquirySources();
          }
        })
      )
    this.inquirySources$ = this.inquirySourcesService.entities$
  }

  getInquirySources(): void {
    this.inquirySourcesService.getAll();
  }

  deleteInquirySource(id: string): void {
    this.sub$.sink = this.inquirySourcesService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('INQUIRY_SOURCE_DELETED_SUCCESSFULLY'));
    });
  }
}
