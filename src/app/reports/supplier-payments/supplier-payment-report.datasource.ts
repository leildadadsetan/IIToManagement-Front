import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { SupplierPayment } from '@core/domain-classes/supplier-payment';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';

export class SupplierPaymentReportDataSource implements DataSource<SupplierPayment> {
    private _supplierPaymentSubject$ = new BehaviorSubject<SupplierPayment[]>([]);
    private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;
    sub$: Subscription;

    public get count(): number {
        return this._count;
    }
    public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

    constructor(private supplierService: SupplierService) {

    }

    connect(): Observable<SupplierPayment[]> {
        this.sub$ = new Subscription();
        return this._supplierPaymentSubject$.asObservable();
    }

    disconnect(): void {
        this._supplierPaymentSubject$.complete();
        this.loadingSubject.complete();
        this.sub$.unsubscribe();
    }

    loadData(supplierResource: SupplierResourceParameter) {
        this.loadingSubject.next(true);
        this.sub$ = this.supplierService.getSupplierPayments(supplierResource)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<SupplierPayment[]>) => {
                if (resp && resp.headers) {
                    const paginationParam = JSON.parse(
                        resp.headers.get('X-Pagination')
                    ) as ResponseHeader;
                    this._responseHeaderSubject$.next(paginationParam);
                    const supplierPayments = [...resp.body];
                    this._count = supplierPayments.length;
                    this._supplierPaymentSubject$.next(supplierPayments);
                }
            });
    }
}