import { Component, OnInit } from '@angular/core';
import { PurchaseOrderRecentDeliverySchedule } from '@core/domain-classes/purchase-order-recent-delivery-schedule';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-purchase-order-expected-delivery',
  templateUrl: './purchase-order-expected-delivery.component.html',
  styleUrls: ['./purchase-order-expected-delivery.component.scss']
})
export class PurchaseOrderExpectedDeliveryComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['Order_Number',  'Supplier_Name', 'ExpectedDispatchDate', 'Quantity'];
  dataSource: PurchaseOrderRecentDeliverySchedule[] = [];
  loading: boolean = false;
  constructor(private dashboardService: DashboardService, public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getSalesOrderRecentShipmentOrder();
  }

  getSalesOrderRecentShipmentOrder() {
    this.loading = true;
    this.dashboardService.getPurchaseOrderRecentDeliverySchedule()
      .subscribe(c => {
        this.loading = false;
        this.dataSource = c;
      }, (err) => this.loading = false);
  }
}
