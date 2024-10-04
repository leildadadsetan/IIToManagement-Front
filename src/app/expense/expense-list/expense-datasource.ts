import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Expense } from '@core/domain-classes/expense';
import { ExpenseResourceParameter } from '@core/domain-classes/expense-source-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ExpenseService } from '../expense.service';

export class ExpenseDataSource implements DataSource<Expense> {
  private _expenseSubject$ = new BehaviorSubject<Expense[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private expenseService: ExpenseService) {
  }

  connect(): Observable<Expense[]> {
    this.sub$ = new Subscription();
    return this._expenseSubject$.asObservable();
  }

  disconnect(): void {
    this._expenseSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(expenseResource: ExpenseResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.expenseService.getExpenses(expenseResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<Expense[]>) => {
        const paginationParam = JSON.parse(
          resp.headers.get('X-Pagination')
        ) as ResponseHeader;
        this._responseHeaderSubject$.next(paginationParam);
        const inquiries = [...resp.body];
        this._count = inquiries.length;
        this._expenseSubject$.next(inquiries);
      });
  }
}
