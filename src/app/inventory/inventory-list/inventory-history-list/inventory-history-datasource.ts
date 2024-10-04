import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { InventoryHistory } from '@core/domain-classes/inventory-history';
import { InventoryService } from '../../inventory.service';
import { InventoryHistoryResourceParameter } from '@core/domain-classes/inventory-history-resource-parameter';

export class InventoryHistoryDataSource implements DataSource<InventoryHistory> {
  private _entities$ = new BehaviorSubject<InventoryHistory[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject$.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private inventoryService: InventoryService) {
    this.sub$ = new Subscription();
  }

  connect(): Observable<InventoryHistory[]> {
    return this._entities$.asObservable();
  }

  disconnect(): void {
    this._entities$.complete();
    this.loadingSubject$.complete();
    this.sub$.unsubscribe();
  }

  loadData(inventoryHistoryResource: InventoryHistoryResourceParameter) {
    this.loadingSubject$.next(true);
    this.sub$ = this.inventoryService.getInventoryHistories(inventoryHistoryResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject$.next(false)))
      .subscribe((resp: HttpResponse<InventoryHistory[]>) => {
        let paginationParam = new ResponseHeader();
        if (resp && resp.headers.get('X-Pagination')) {
          paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
        }
        this._responseHeaderSubject$.next(paginationParam);
        const entities = [...resp.body];
        this._count = entities.length;
        this._entities$.next(entities);
      });
  }
}
