import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { ReminderResourceParameter } from '@core/domain-classes/reminder-resource-parameter';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';

export class NotificationDataSource implements DataSource<ReminderScheduler> {
  private _entities$ = new BehaviorSubject<ReminderScheduler[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject$.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private notificationService: NotificationService) {
    this.sub$ = new Subscription();
  }

  connect(): Observable<ReminderScheduler[]> {
    return this._entities$.asObservable();
  }

  disconnect(): void {
    this._entities$.complete();
    this.loadingSubject$.complete();
    this.sub$.unsubscribe();
  }

  loadData(resource: ReminderResourceParameter) {
    this.loadingSubject$.next(true);
    this.sub$ = this.notificationService.getNotifications(resource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject$.next(false)))
      .subscribe((resp: HttpResponse<ReminderScheduler[]>) => {
        if (resp && resp.headers && resp.headers.get('X-Pagination')) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
          const entities = [...resp.body];
          this._count = entities.length;
          this._entities$.next(entities);
        } else {
          this._entities$.next([]);
        }
      });
  }
}
