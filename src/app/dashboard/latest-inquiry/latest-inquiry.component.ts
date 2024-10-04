import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryResourceParameter } from '@core/domain-classes/inquiry-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { InquiryService } from 'src/app/inquiry/inquiry.service';

@Component({
  selector: 'app-latest-inquiry',
  templateUrl: './latest-inquiry.component.html',
  styleUrls: ['./latest-inquiry.component.scss']
})
export class LatestInquiryComponent extends BaseComponent implements OnInit {
  inquiries: Inquiry[] = [];
  displayedInquiryColumns: string[] = ['action', 'createdDate', 'companyName', 'status', 'source', 'assignTo', 'email', 'mobileNo', 'cityName', 'taskCount', 'commentCount', 'attachmentCount'];
  inquiryResource: InquiryResourceParameter;
  constructor(private inquiryService: InquiryService,public translationSerivece:TranslationService) {
    super(translationSerivece);
    this.getLangDir();
   }

  ngOnInit(): void {
    this.inquiryResource = new InquiryResourceParameter();
    this.inquiryResource.pageSize = 10;
    this.inquiryResource.orderBy = 'createdDate desc';
    this.getTop10Inquiries();
  }

  getTop10Inquiries() {
    this.inquiryService.getInquiries(this.inquiryResource)
      .subscribe((resp: HttpResponse<Inquiry[]>) => {
        this.inquiries = [...resp.body];
      });
  }

}
