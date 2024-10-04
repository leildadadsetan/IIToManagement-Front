import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { PurchasePaymentReportService } from './purchase-payment-report.service';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';

export class PurchasePaymentReportDataSource implements DataSource<PurchaseOrderPayment> {
  private _purchaseOrderSubject$ = new BehaviorSubject<PurchaseOrderPayment[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private purchasePaymentReportService: PurchasePaymentReportService) {

  }

  connect(): Observable<PurchaseOrderPayment[]> {
    this.sub$ = new Subscription();
    return this._purchaseOrderSubject$.asObservable();
  }

  disconnect(): void {
    this._purchaseOrderSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(purchaseOrderResource: PurchaseOrderResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.purchasePaymentReportService.getAllPurchaseOrderPaymentReport(purchaseOrderResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<PurchaseOrderPayment[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
          const purchaseOrders = [...resp.body];
          this._count = purchaseOrders.length;
          this._purchaseOrderSubject$.next(purchaseOrders);
        }
      });
  }
}
