import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SalesOrderService } from './sales-order.service';

export class SalesOrderDataSource implements DataSource<SalesOrder> {
  private _salesOrderSubject$ = new BehaviorSubject<SalesOrder[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private salesOrderService: SalesOrderService) {
  }

  connect(): Observable<SalesOrder[]> {
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
    this.sub$ = this.salesOrderService.getAllSalesOrder(salesOrderResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<SalesOrder[]>) => {
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
