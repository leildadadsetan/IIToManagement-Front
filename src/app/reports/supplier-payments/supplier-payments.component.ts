import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierPayment } from '@core/domain-classes/supplier-payment';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { SupplierPaymentReportDataSource } from './supplier-payment-report.datasource';
import * as XLSX from 'xlsx';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-supplier-payments',
  templateUrl: './supplier-payments.component.html',
  styleUrls: ['./supplier-payments.component.scss'],
  providers: [UTCToLocalTime, CustomCurrencyPipe]
})
export class SupplierPaymentsComponent extends BaseComponent implements OnInit {
  dataSource: SupplierPaymentReportDataSource;
  displayedColumns: string[] = ['supplierName', 'totalAmount', 'totalPaidAmount', 'totalPendingAmount'];
  columnsToDisplay: string[] = ["footer"];
  isLoadingResults = true;
  supplierResource: SupplierResourceParameter;
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
    const nameFilter = `supplierName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  constructor(
    private supplierService: SupplierService,
    public translateService: TranslationService,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe) {
    super(translateService);
    this.getLangDir();
    this.supplierResource = new SupplierResourceParameter();
    this.supplierResource.pageSize = 10;
    this.supplierResource.orderBy = 'supplierName asc'
  }

  ngOnInit(): void {
    this.dataSource = new SupplierPaymentReportDataSource(this.supplierService);
    this.dataSource.loadData(this.supplierResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.supplierResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'supplierName') {
          this.supplierResource.supplierName = escape(strArray[1]);
        }
        this.dataSource.loadData(this.supplierResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.supplierResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.supplierResource.pageSize = this.paginator.pageSize;
          this.supplierResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.supplierResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.supplierResource.pageSize = c.pageSize;
          this.supplierResource.skip = c.skip;
          this.supplierResource.totalCount = c.totalCount;
        }
      });
  }

  onDownloadReport() {
    this.supplierService.getSupplierPaymentsExcel(this.supplierResource)
      .subscribe((c: HttpResponse<SupplierPayment[]>) => {
        let customerPayments = [...c.body];
        let heading = [[this.translateService.getValue('NAME'), this.translateService.getValue('TOTAL_AMOUNT'), this.translateService.getValue('TOTAL_PAID_AMOUNT'), this.translateService.getValue('TOTAL_PENDING_AMOUNT')]];

        let customerPaymentsReport = [];
        customerPayments.forEach((customerPayment: SupplierPayment) => {
          customerPaymentsReport.push({
            'name': customerPayment.supplierName,
            'totalAmount': this.customCurrencyPipe.transform(customerPayment.totalAmount),
            'totalPaidAmount': this.customCurrencyPipe.transform(customerPayment.totalPaidAmount),
            'totalPendingAmount': this.customCurrencyPipe.transform(customerPayment.totalPendingAmount < 0 ? 0 : customerPayment.totalPendingAmount)
          });
        });

        let workBook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(workBook, heading);
        let workSheet = XLSX.utils.sheet_add_json(workBook, customerPaymentsReport, { origin: "A2", skipHeader: true });
        XLSX.utils.book_append_sheet(workBook, workSheet,this.translationService.getValue('SUPPLIER_PAYMENT_REPORT'));
        XLSX.writeFile(workBook,this.translationService.getValue('SUPPLIER_PAYMENT_REPORT') +".xlsx");
      });
  }

}
