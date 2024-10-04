import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryResourceParameter } from '@core/domain-classes/inquiry-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { InquiryService } from '../inquiry.service';

export class InquiryDataSource implements DataSource<Inquiry> {
  private _inquirySubject$ = new BehaviorSubject<Inquiry[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private inquiryService: InquiryService) {
  }

  connect(): Observable<Inquiry[]> {
    this.sub$ = new Subscription();
    return this._inquirySubject$.asObservable();
  }

  disconnect(): void {
    this._inquirySubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(inquiryResource: InquiryResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.inquiryService.getInquiries(inquiryResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<Inquiry[]>) => {
        const paginationParam = JSON.parse(
          resp.headers.get('X-Pagination')
        ) as ResponseHeader;
        this._responseHeaderSubject$.next(paginationParam);
        const inquiries = [...resp.body];
        this._count = inquiries.length;
        this._inquirySubject$.next(inquiries);
      });
  }
}
