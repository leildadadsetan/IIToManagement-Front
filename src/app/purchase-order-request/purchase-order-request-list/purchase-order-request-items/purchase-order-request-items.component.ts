import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';

@Component({
  selector: 'app-purchase-order-request-items',
  templateUrl: './purchase-order-request-items.component.html',
  styleUrls: ['./purchase-order-request-items.component.scss']
})
export class PurchaseOrderRequestItemsComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() purchaseOrder: PurchaseOrder;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ['productName', 'unitName', 'unitPrice', 'quantity', 'totalDiscount', 'taxes', 'totalTax', 'totalAmount','warehouse'];

  constructor(private purchaseOrderService: PurchaseOrderService,public translationService:TranslationService) { 
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['purchaseOrder']) {
      this.getPurchaseOrderItems();
    }
  }

  getPurchaseOrderItems() {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderItems(this.purchaseOrder.id)
      .subscribe((data: PurchaseOrderItem[]) => {
        this.isLoading = false;
        this.purchaseOrderItems = data;
      }, () => this.isLoading = false)
  }

}
