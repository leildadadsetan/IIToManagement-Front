import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { City } from '@core/domain-classes/city';
import { CityResourceParameter } from '@core/domain-classes/city-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CityService } from '../city.service';

export class CityDataSource implements DataSource<City> {
  private _entities$ = new BehaviorSubject<City[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject$.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private cityService: CityService) {
    this.sub$ = new Subscription();
  }

  connect(): Observable<City[]> {
    return this._entities$.asObservable();
  }

  disconnect(): void {
    this._entities$.complete();
    this.loadingSubject$.complete();
    this.sub$.unsubscribe();
  }

  loadData(cityResource: CityResourceParameter) {
    this.loadingSubject$.next(true);
    this.sub$ = this.cityService.getCities(cityResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject$.next(false)))
      .subscribe((resp: HttpResponse<City[]>) => {
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
