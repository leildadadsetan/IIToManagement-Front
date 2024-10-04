import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Warehouse } from '@core/domain-classes/warehouse';
import { WarehouseInventory } from '@core/domain-classes/warehouseInventory';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { WarehouseStockReportService } from '../warehouse-stock-report.service';

@Component({
  selector: 'app-warehouse-product-items',
  templateUrl: './warehouse-product-items.component.html',
  styleUrls: ['./warehouse-product-items.component.scss']
})
export class WarehouseProductItemsComponent  extends BaseComponent implements  OnInit, OnChanges {
  @Input() warehouse: Warehouse;
  warehouseInventory: WarehouseInventory[] = [];
  isLoading = false;
  displayedColumns: string[] = ['productName','stock'];

  constructor(private warehouseStockReportService: WarehouseStockReportService,public translationService:TranslationService) {
    super(translationService);
    this.getLangDir();
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['warehouse']) {
      this.getWarehouseProduct();
    }
  }

  getWarehouseProduct() {
    this.isLoading = true;
    this.warehouseStockReportService.getWarehouseProduct(this.warehouse.id)
      .subscribe((data: WarehouseInventory[]) => {
        this.isLoading = false;
        this.warehouseInventory = data;
      }, () => this.isLoading = false)
  }

}
