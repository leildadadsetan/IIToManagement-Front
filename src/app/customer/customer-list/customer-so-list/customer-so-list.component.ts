import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SalesOrderDataSource } from 'src/app/sales-order/sales-order-datasource';
import { SalesOrderService } from 'src/app/sales-order/sales-order.service';

@Component({
  selector: 'app-customer-so-list',
  templateUrl: './customer-so-list.component.html',
  styleUrls: ['./customer-so-list.component.scss']
})
export class CustomerSoListComponent extends BaseComponent implements OnChanges {
  @Input() customerId: string;
  dataSource: SalesOrderDataSource;
  saleOrders: SalesOrder[] = [];
  displayedColumns: string[] = ['soCreatedDate', 'orderNumber',  'totalDiscount', 'totalTax', 'totalAmount','paymentStatus'];
  footerToDisplayed: string[] = ['footer'];
  salesOrderResource: SalesOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private salesOrderService: SalesOrderService,
    public translationService: TranslationService) {
super(translationService);
    this.getLangDir();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId']) {
      this.getSalesOrder();
    }
  }

  getSalesOrder(): void {
    this.salesOrderResource = new SalesOrderResourceParameter();
    this.salesOrderResource.pageSize = 5;
    this.salesOrderResource.orderBy = 'soCreatedDate asc'
    this.salesOrderResource.customerId = this.customerId;
    this.dataSource = new SalesOrderDataSource(this.salesOrderService);
    this.dataSource.loadData(this.salesOrderResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.salesOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.salesOrderResource.pageSize = this.paginator.pageSize;
          this.salesOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.salesOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.salesOrderResource.pageSize = c.pageSize;
          this.salesOrderResource.skip = c.skip;
          this.salesOrderResource.totalCount = c.totalCount;
        }
      });
  }
}
