import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';
import { SalesPaymentReportService } from './sales-payment-report.service';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';

export class SalesPaymentReportDataSource implements DataSource<SalesOrderPayment> {
  private _salesOrderSubject$ = new BehaviorSubject<SalesOrderPayment[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private salesPaymentReportService: SalesPaymentReportService) {

  }

  connect(): Observable<SalesOrderPayment[]> {
    this.sub$ = new Subscription();
    return this._salesOrderSubject$.asObservable();
  }

  disconnect(): void {
    this._salesOrderSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(salesOrderResource: SalesOrderResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.salesPaymentReportService.getAllSalesOrderPaymentReport(salesOrderResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<SalesOrderPayment[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
          const salesOrders = [...resp.body];
          this._count = salesOrders.length;
          this._salesOrderSubject$.next(salesOrders);
        }
      });
  }
}
