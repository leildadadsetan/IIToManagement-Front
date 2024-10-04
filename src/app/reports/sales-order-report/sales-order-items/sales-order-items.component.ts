import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { SalesOrderService } from 'src/app/sales-order/sales-order.service';


@Component({
  selector: 'app-sales-order-items',
  templateUrl: './sales-order-items.component.html',
  styleUrls: ['./sales-order-items.component.scss']
})
export class SalesOrderItemsComponent extends BaseComponent implements  OnInit, OnChanges {
  @Input() salesOrder: SalesOrder;
  salesOrderItems: SalesOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ['productName','source', 'unitName', 'unitPrice', 'quantity',  'totalDiscount', 'taxes', 'totalTax','totalAmount'];

  constructor(private salesOrderService: SalesOrderService,public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['salesOrder']) {
      this.getSalesOrderItems();
    }
  }

  getSalesOrderItems() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderItems(this.salesOrder.id)
      .subscribe((data: SalesOrderItem[]) => {
        this.isLoading = false;
        this.salesOrderItems = data;
      }, () => this.isLoading = false)
  }

}
