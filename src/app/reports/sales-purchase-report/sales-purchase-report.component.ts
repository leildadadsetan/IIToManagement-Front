import { Component, OnInit } from '@angular/core';
import { Months } from '@core/domain-classes/months';
import { SalesVsPurchase } from '@core/domain-classes/sales-purchase';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { SalesPurchaseReportService } from './sales-purchase-report.service';

@Component({
  selector: 'app-sales-purchase-report',
  templateUrl: './sales-purchase-report.component.html',
  styleUrls: ['./sales-purchase-report.component.scss']
})
export class SalesPurchaseReportComponent implements OnInit {
  months = Months;
  years = [];
  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  barChartOptions: ChartOptions = {
    responsive: true,
  };

  lineChartColors: any[] = [
    {
      backgroundColor: '#2196f3',
    },
  ];

  constructor(private salesPurchaseReportService: SalesPurchaseReportService,
    private uTCToLocalTime: UTCToLocalTime) { }

  ngOnInit(): void {
    for (let index = 1995; index < 2050; index++) {
      this.years.push(index);
    }
    this.getReportData();
  }

  getReportData() {
    this.salesPurchaseReportService.getSalesVsPurchaseReport(this.selectedMonth, this.selectedYear).subscribe((data: SalesVsPurchase[]) => {
      const totalSales = data.map(c =>  c.totalSales);
      const totalPurchase = data.map(c => c.totalPurchase);
      this.barChartData = [
        { data: totalSales, label: 'Sales' },
        { data: totalPurchase, label: 'Purchase' }
      ];
      this.barChartLabels = data.map(c => this.uTCToLocalTime.transform(c.date, 'shortDate'));
    });
  }
}
