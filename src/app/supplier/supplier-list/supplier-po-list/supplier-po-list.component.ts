import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderDataSource } from 'src/app/purchase-order/purchase-order-list/purchase-order-datasource';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';

@Component({
  selector: 'app-supplier-po-list',
  templateUrl: './supplier-po-list.component.html',
  styleUrls: ['./supplier-po-list.component.scss']
})
export class SupplierPOListComponent extends BaseComponent implements OnChanges {
  @Input() supplierId: string;
  dataSource: PurchaseOrderDataSource;
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = ['poCreatedDate', 'orderNumber', 'totalDiscount', 'totalTax', 'totalAmount','paymentStatus'];
  footerToDisplayed: string[] = ['footer'];
  purchaseOrderResource: PurchaseOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private purchaseOrderService: PurchaseOrderService,
    public translationService: TranslationService) {
super(translationService);
    this.getLangDir();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplierId']) {
      this.getPurchaseOrder();
    }
  }

  getPurchaseOrder(): void {
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 5;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc'
    this.purchaseOrderResource.supplierId = this.supplierId;
    this.dataSource = new PurchaseOrderDataSource(this.purchaseOrderService);
    this.dataSource.loadData(this.purchaseOrderResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.purchaseOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.purchaseOrderResource.pageSize = this.paginator.pageSize;
          this.purchaseOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.purchaseOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.purchaseOrderResource.pageSize = c.pageSize;
          this.purchaseOrderResource.skip = c.skip;
          this.purchaseOrderResource.totalCount = c.totalCount;
        }
      });
  }
}
