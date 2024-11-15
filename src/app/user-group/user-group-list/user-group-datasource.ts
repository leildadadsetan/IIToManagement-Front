import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { UserGroup } from '@core/domain-classes/user-group';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserGroupService } from '../user-group.service';

export class UserGroupDataSource implements DataSource<UserGroup> {
  private _groupSubject$ = new BehaviorSubject<UserGroup[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private userGroupService: UserGroupService) {
  }

  connect(): Observable<UserGroup[]> {
    this.sub$ = new Subscription();
    return this._groupSubject$.asObservable();
  }

  disconnect(): void {
    this._groupSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(userGroupResource: GroupResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.userGroupService.getUserGroups(userGroupResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<UserGroup[]>) => {
        const paginationParam = JSON.parse(
          resp.headers.get('X-Pagination')
        ) as ResponseHeader;
        this._responseHeaderSubject$.next(paginationParam);
        const inquiries = [...resp.body];
        this._count = inquiries.length;
        this._groupSubject$.next(inquiries);
      });
  }
}
