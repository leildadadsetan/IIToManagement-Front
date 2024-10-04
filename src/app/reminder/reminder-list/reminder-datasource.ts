import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Reminder } from '@core/domain-classes/reminder';
import { ReminderResourceParameter } from '@core/domain-classes/reminder-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ReminderService } from '../reminder.service';

export class ReminderDataSource implements DataSource<Reminder> {
  private _reminderSubject$ = new BehaviorSubject<Reminder[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private reminderService: ReminderService) {
  }

  connect(): Observable<Reminder[]> {
    this.sub$ = new Subscription();
    return this._reminderSubject$.asObservable();
  }

  disconnect(): void {
    this._reminderSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(reminderResource: ReminderResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.reminderService.getReminders(reminderResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<Reminder[]>) => {
        if (resp && resp.headers.get('X-Pagination')) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
        }
        if (resp) {
          const inquiries = [...resp.body];
          this._count = inquiries.length;
          this._reminderSubject$.next(inquiries);
        }
      });
  }
}
