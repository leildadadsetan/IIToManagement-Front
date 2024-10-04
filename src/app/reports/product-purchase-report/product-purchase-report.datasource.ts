import { DataSource } from "@angular/cdk/collections";
import { HttpResponse } from "@angular/common/http";
import { PurchaseOrderItem } from "@core/domain-classes/purchase-order-item";
import { PurchaseOrderResourceParameter } from "@core/domain-classes/purchase-order-resource-parameter";
import { ResponseHeader } from "@core/domain-classes/response-header";
import { BehaviorSubject, Subscription, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { PurchaseOrderService } from "src/app/purchase-order/purchase-order.service";

export class ProductPurchaseReportDataSource implements DataSource<PurchaseOrderItem> {
    private _customerPaymentSubject$ = new BehaviorSubject<PurchaseOrderItem[]>([]);
    private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;
    sub$: Subscription;

    public get count(): number {
        return this._count;
    }
    public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

    constructor(private purchaseOrderService: PurchaseOrderService) {

    }

    connect(): Observable<PurchaseOrderItem[]> {
        this.sub$ = new Subscription();
        return this._customerPaymentSubject$.asObservable();
    }

    disconnect(): void {
        this._customerPaymentSubject$.complete();
        this.loadingSubject.complete();
        this.sub$.unsubscribe();
    }

    loadData(customerResource: PurchaseOrderResourceParameter) {
        this.loadingSubject.next(true);
        this.sub$ = this.purchaseOrderService.getPurchaseOrderItemReport(customerResource)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<PurchaseOrderItem[]>) => {
                if (resp && resp.headers) {
                    const paginationParam = JSON.parse(
                        resp.headers.get('X-Pagination')
                    ) as ResponseHeader;
                    this._responseHeaderSubject$.next(paginationParam);
                    const customerPayments = [...resp.body];
                    this._count = customerPayments.length;
                    this._customerPaymentSubject$.next(customerPayments);
                }
            });
    }
}
