import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { dateCompare } from '@core/services/date-range';
import { TranslationService } from '@core/services/translation.service';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { PurchasePaymentReportDataSource } from './purchase-payment-report.datasource';
import { PurchasePaymentReportService } from './purchase-payment-report.service';
import * as XLSX from 'xlsx';
import { PaymentMethodPipe } from '@shared/pipes/paymentMethod.pipe';

@Component({
  selector: 'app-purchase-payment-report',
  templateUrl: './purchase-payment-report.component.html',
  styleUrls: ['./purchase-payment-report.component.scss'],
  providers:[UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe,PaymentMethodPipe]
})
export class PurchasePaymentReportComponent extends BaseComponent implements OnInit {
  dataSource : PurchasePaymentReportDataSource;
  isData: boolean = false;
  isDeleted = false;
  purchaseOrderResource:PurchaseOrderResourceParameter;
  searchForm: UntypedFormGroup;

  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentDate: Date= new Date();

  constructor(
    private purchasePaymentReportService: PurchasePaymentReportService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,
    private paymentStatusPipe: PaymentStatusPipe,
    public translationService: TranslationService,
    private paymentMethodPipe: PaymentMethodPipe) {
    super(translationService);
    this.getLangDir();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
  }

  displayedColumns: string[] = [ 'paymentDate','orderNumber', 'referenceNumber', 'amount', 'paymentMethod'];
  footerToDisplayed = ['footer']


  ngOnInit(): void {
    this.createSearchFormGroup();
    this.dataSource = new PurchasePaymentReportDataSource(this.purchasePaymentReportService);
    this.dataSource.loadData(this.purchaseOrderResource);
    this.getResourceParameter();
  }

  createSearchFormGroup(){
    this.searchForm= this.fb.group({
      fromDate:[''],
      toDate:[''],
      filterProductValue:[''],
    },{
      validators: dateCompare()
    });
  }



  onSearch(){
   if( this.searchForm.valid){
    this.purchaseOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.purchaseOrderResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.purchaseOrderResource);
   }
  }

  onClear(){
    this.searchForm.reset();
    this.purchaseOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.purchaseOrderResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.purchaseOrderResource);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.purchaseOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.purchaseOrderResource.pageSize = this.paginator.pageSize;
          this.purchaseOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.purchaseOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.purchaseOrderResource.pageSize = c.pageSize;
          this.purchaseOrderResource.skip = c.skip;
          this.purchaseOrderResource.totalCount = c.totalCount;
        }
      });
  }


  onDownloadReport(){
    this.purchasePaymentReportService.getAllPurchaseOrderPaymentReportExcel(this.purchaseOrderResource)
    .subscribe((c: HttpResponse<PurchaseOrderPayment[]>)=>{
     const purchaseOrderPayments= [...c.body];
      let heading=[[
        this.translationService.getValue('PAYMENT_DATE'),
      this.translationService.getValue('PO_NUMBER'),
      this.translationService.getValue('REFERENCE_NUMBER'),
      this.translationService.getValue('AMOUNT'),
      this.translationService.getValue('PAID_BY')
    ]];

      let purchaseOrderPaymentReport= [];
      purchaseOrderPayments.forEach((purchaseOrderPayment: PurchaseOrderPayment)=>{
        purchaseOrderPaymentReport.push({
            'PAYMENT_DATE':   this.utcToLocalTime.transform(purchaseOrderPayment.paymentDate,'shortDate'),
            'PO_NUMBER': purchaseOrderPayment.orderNumber,
            'REFERENCE_NUMBER': purchaseOrderPayment.referenceNumber,
            'AMOUNT':this.customCurrencyPipe.transform(purchaseOrderPayment.amount),
            'PAID_BY':  this.paymentMethodPipe.transform(purchaseOrderPayment.paymentMethod)
          });
      });

      let workBook= XLSX.utils.book_new();
      XLSX.utils.sheet_add_aoa(workBook,heading);
      let workSheet= XLSX.utils.sheet_add_json(workBook, purchaseOrderPaymentReport, {origin: "A2", skipHeader:true });
      XLSX.utils.book_append_sheet(workBook,workSheet,this.translationService.getValue('PURCHASE_PAYMENT_REPORT'));
      XLSX.writeFile(workBook,this.translationService.getValue('PURCHASE_PAYMENT_REPORT') +".xlsx");
    });
  }


}
