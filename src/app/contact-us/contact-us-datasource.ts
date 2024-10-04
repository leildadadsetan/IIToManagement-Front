import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ContactUs } from '@core/domain-classes/contact-us';
import { ContactUsResource } from '@core/domain-classes/contact-us-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ContactUsService } from './contact-us.service';

export class ContactUsDataSource implements DataSource<ContactUs> {
  private _contactUsSubject$ = new BehaviorSubject<ContactUs[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private contactUsService: ContactUsService) {
  }

  connect(): Observable<ContactUs[]> {
    this.sub$ = new Subscription();
    return this._contactUsSubject$.asObservable();
  }

  disconnect(): void {
    this._contactUsSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(contactUsResource: ContactUsResource) {
    this.loadingSubject.next(true);
    this.sub$ = this.contactUsService.getContactUsList(contactUsResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<ContactUsResource[]>) => {
        const paginationParam = JSON.parse(
          resp.headers.get('X-Pagination')
        ) as ResponseHeader;
        this._responseHeaderSubject$.next(paginationParam);
        const entities = [...resp.body];
        this._count = entities.length;
        this._contactUsSubject$.next(entities);
      });
  }
}
