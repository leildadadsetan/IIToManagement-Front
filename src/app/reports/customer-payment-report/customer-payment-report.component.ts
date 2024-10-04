import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from 'src/app/customer/customer.service';
import { CustomerPaymentReportDataSource } from './customer-payment-report.datasource';
import * as XLSX from 'xlsx';
import { CustomerPayment } from '@core/domain-classes/customer-payment';
import { HttpResponse } from '@angular/common/http';
import { TranslationService } from '@core/services/translation.service';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';

@Component({
  selector: 'app-customer-payment-report',
  templateUrl: './customer-payment-report.component.html',
  styleUrls: ['./customer-payment-report.component.scss'],
  providers: [UTCToLocalTime, CustomCurrencyPipe]
})
export class CustomerPaymentReportComponent extends BaseComponent implements OnInit {
  dataSource: CustomerPaymentReportDataSource;
  displayedColumns: string[] = ['customerName', 'totalAmount', 'totalPaidAmount', 'totalPendingAmount'];
  columnsToDisplay: string[] = ["footer"];
  isLoadingResults = true;
  customerResource: CustomerResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `customerName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  constructor(
    private customerService: CustomerService,
    private translateService: TranslationService,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
    this.customerResource = new CustomerResourceParameter();
    this.customerResource.pageSize = 10;
    this.customerResource.orderBy = 'customerName asc'
  }

  ngOnInit(): void {
    this.dataSource = new CustomerPaymentReportDataSource(this.customerService);
    this.dataSource.loadData(this.customerResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.customerResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'customerName') {
          this.customerResource.customerName = escape(strArray[1]);
        }
        this.dataSource.loadData(this.customerResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.customerResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.customerResource.pageSize = this.paginator.pageSize;
          this.customerResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.customerResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.customerResource.pageSize = c.pageSize;
          this.customerResource.skip = c.skip;
          this.customerResource.totalCount = c.totalCount;
        }
      });
  }
  onDownloadReport() {
    this.customerService.getCustomerPaymentsReport(this.customerResource)
      .subscribe((c: HttpResponse<CustomerPayment[]>) => {
        let customerPayments = [...c.body];
        let heading = [[this.translateService.getValue('NAME'), this.translateService.getValue('TOTAL_AMOUNT'), this.translateService.getValue('TOTAL_PAID_AMOUNT'), this.translateService.getValue('TOTAL_PENDING_AMOUNT')]];

        let customerPaymentsReport = [];
        customerPayments.forEach((customerPayment: CustomerPayment) => {
          customerPaymentsReport.push({
            'name': customerPayment.customerName,
            'totalAmount': this.customCurrencyPipe.transform(customerPayment.totalAmount),
            'totalPaidAmount': this.customCurrencyPipe.transform(customerPayment.totalPaidAmount),
            'totalPendingAmount': this.customCurrencyPipe.transform(customerPayment.totalPendingAmount < 0 ? 0 : customerPayment.totalPendingAmount)
          });
        });

        let workBook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(workBook, heading);
        let workSheet = XLSX.utils.sheet_add_json(workBook, customerPaymentsReport, { origin: "A2", skipHeader: true });
        XLSX.utils.book_append_sheet(workBook, workSheet,this.translationService.getValue('CUSTOMER_PAYMENT_REPORT') );
        XLSX.writeFile(workBook,this.translationService.getValue('CUSTOMER_PAYMENT_REPORT') + ".xlsx");
      });
  }
}
