import { Component, OnInit } from '@angular/core';
import { BestSellingProudct } from '@core/domain-classes/bast-selling-product';
import { Months } from '@core/domain-classes/months';
import { TranslationService } from '@core/services/translation.service';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-best-selling-product',
  templateUrl: './best-selling-product.component.html',
  styleUrls: ['./best-selling-product.component.scss']
})
export class BestSellingProductComponent implements OnInit {
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



  constructor(private dashboardService: DashboardService,
    public translationService: TranslationService) { }

  ngOnInit() {
    for (let index = 1995; index < 2050; index++) {
      this.years.push(index);
    }
    this.getBestSellingProducts();
  }

  getBestSellingProducts() {
    this.dashboardService.getBestSellingProducts(this.selectedMonth, this.selectedYear).subscribe((data: BestSellingProudct[]) => {
      const salesCount = data.map(c => c.count);
      this.barChartData = [
        { data: salesCount, label: this.translationService.getValue('SALES') }
      ];
      this.barChartLabels = data.map(c => c.name);
    });
  }
}
