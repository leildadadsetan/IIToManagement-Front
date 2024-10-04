import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProductService } from '../product.service';

export class ProductDataSource implements DataSource<Product> {
  private _entities$ = new BehaviorSubject<Product[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject$.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private productService: ProductService) {
    this.sub$ = new Subscription();
  }

  connect(): Observable<Product[]> {
    return this._entities$.asObservable();
  }

  disconnect(): void {
    this._entities$.complete();
    this.loadingSubject$.complete();
    this.sub$.unsubscribe();
  }

  loadData(resource: ProductResourceParameter) {
    this.loadingSubject$.next(true);
    this.sub$ = this.productService.getProducts(resource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject$.next(false)))
      .subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers.get('X-Pagination')) {
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
