import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Inventory } from '@core/domain-classes/inventory';
import { InventoryHistoryResourceParameter } from '@core/domain-classes/inventory-history-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { InventoryHistoryDataSource } from './inventory-history-datasource';

@Component({
  selector: 'app-inventory-history-report-list',
  templateUrl: './inventory-history-list.component.html',
  styleUrls: ['./inventory-history-list.component.scss']
})
export class InventoryHistoryListComponent extends BaseComponent implements OnInit, OnChanges {
  dataSource: InventoryHistoryDataSource;
  displayedColumns: string[] = ['createdDate', 'inventorySource', 'stock', 'pricePerUnit'];
  columnsToDisplay: string[] = ["footer"];
  inventoryHistoryResource: InventoryHistoryResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() inventory: Inventory;

  constructor(
    private inventoryService: InventoryService,public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
    this.inventoryHistoryResource = new InventoryHistoryResourceParameter();
    this.inventoryHistoryResource.pageSize = 10;
    this.inventoryHistoryResource.orderBy = 'createdDate asc'
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inventory']) {
      this.inventoryHistoryResource.productId = this.inventory.productId;
      this.dataSource = new InventoryHistoryDataSource(this.inventoryService);
      this.dataSource.loadData(this.inventoryHistoryResource);
      this.getResourceParameter();
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.inventoryHistoryResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.inventoryHistoryResource.pageSize = this.paginator.pageSize;
          this.inventoryHistoryResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.inventoryHistoryResource);
        })
      )
      .subscribe();
  }


  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.inventoryHistoryResource.pageSize = c.pageSize;
          this.inventoryHistoryResource.skip = c.skip;
          this.inventoryHistoryResource.totalCount = c.totalCount;
        }
      });
  }

}
