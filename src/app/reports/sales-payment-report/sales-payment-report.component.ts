import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { dateCompare } from '@core/services/date-range';
import { TranslationService } from '@core/services/translation.service';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { PaymentMethodPipe } from '@shared/pipes/paymentMethod.pipe';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SalesPaymentReportDataSource } from './sales-payment-report.datasource';
import { SalesPaymentReportService } from './sales-payment-report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sales-payment-report',
  templateUrl: './sales-payment-report.component.html',
  styleUrls: ['./sales-payment-report.component.scss'],
  providers:[UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe,PaymentMethodPipe]
})
export class SalesPaymentReportComponent extends BaseComponent implements OnInit {

  dataSource : SalesPaymentReportDataSource;
  isData: boolean = false;
  isDeleted = false;
  salesOrderResource:SalesOrderResourceParameter;
  searchForm: UntypedFormGroup;

  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentDate: Date= new Date();

  constructor(
    private salesPaymentReportService: SalesPaymentReportService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService,
    private fb: UntypedFormBuilder,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,
    private paymentMethodPipe: PaymentMethodPipe) {
    super(translationService);
    this.getLangDir();
    this.salesOrderResource = new SalesOrderResourceParameter();
  }

  displayedColumns: string[] = [ 'paymentDate','orderNumber', 'referenceNumber', 'amount', 'paymentMethod'];
  footerToDisplayed = ['footer']


  ngOnInit(): void {
    this.createSearchFormGroup();
    this.dataSource = new SalesPaymentReportDataSource(this.salesPaymentReportService);
    this.dataSource.loadData(this.salesOrderResource);
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
    this.salesOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.salesOrderResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.salesOrderResource);
   }
  }

  onClear(){
    this.searchForm.reset();
    this.salesOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.salesOrderResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.salesOrderResource);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.salesOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.salesOrderResource.pageSize = this.paginator.pageSize;
          this.salesOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.salesOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.salesOrderResource.pageSize = c.pageSize;
          this.salesOrderResource.skip = c.skip;
          this.salesOrderResource.totalCount = c.totalCount;
        }
      });
  }

  onDownloadReport(){
    this.salesPaymentReportService.getAllSalesOrderPaymentReportExcel(this.salesOrderResource)
    .subscribe((c: HttpResponse<SalesOrderPayment[]>)=>{
     const salesOrderPayments= [...c.body];
      let heading=[[
        this.translationService.getValue('PAYMENT_DATE'),
      this.translationService.getValue('SO_NUMBER'),
      this.translationService.getValue('REFERENCE_NUMBER'),
      this.translationService.getValue('AMOUNT'),
      this.translationService.getValue('PAID_BY')
    ]];

      let saleOrderPaymentReport= [];
      salesOrderPayments.forEach((salesOrderPayment: SalesOrderPayment)=>{
        saleOrderPaymentReport.push({
            'PAYMENT_DATE':   this.utcToLocalTime.transform(salesOrderPayment.paymentDate,'shortDate'),
            'SO_NUMBER': salesOrderPayment.orderNumber,
            'REFERENCE_NUMBER': salesOrderPayment.referenceNumber,
            'AMOUNT':this.customCurrencyPipe.transform(salesOrderPayment.amount),
            'PAID_BY':  this.paymentMethodPipe.transform(salesOrderPayment.paymentMethod)
          });
      });

      let workBook= XLSX.utils.book_new();
      XLSX.utils.sheet_add_aoa(workBook,heading);
      let workSheet= XLSX.utils.sheet_add_json(workBook, saleOrderPaymentReport, {origin: "A2", skipHeader:true });
      XLSX.utils.book_append_sheet(workBook,workSheet,this.translationService.getValue('SALES_PAYMENT_ORDER_REPORT'));
      XLSX.writeFile(workBook,this.translationService.getValue('SALES_PAYMENT_ORDER_REPORT') + ".xlsx");
    });
  }


}
