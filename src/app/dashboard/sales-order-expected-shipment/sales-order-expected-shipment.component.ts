import { Component, OnInit } from '@angular/core';
import { SalesOrderRecentShipmentDate } from '@core/domain-classes/sales-order-recent-shipment-date';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-sales-order-expected-shipment',
  templateUrl: './sales-order-expected-shipment.component.html',
  styleUrls: ['./sales-order-expected-shipment.component.scss']
})
export class SalesOrderExpectedShipmentComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['Order_Number', 'Customer_Name', 'Expected_Shipment_Date', 'Quantity'];
  dataSource: SalesOrderRecentShipmentDate[] = [];
  loading: boolean = false;
  constructor(private dashboardService: DashboardService,public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getSalesOrderRecentShipmentOrder();
  }

  getSalesOrderRecentShipmentOrder() {
    this.loading = true;
    this.dashboardService.getSalesOrderRecentShipmentDate()
      .subscribe(c => {
        this.loading = false;
        this.dataSource = c;
      }, (err) => this.loading = false);
  }

}
