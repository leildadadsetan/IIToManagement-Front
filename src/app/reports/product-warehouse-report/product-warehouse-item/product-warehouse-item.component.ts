import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from '@core/domain-classes/product';
import { ProductShort } from '@core/domain-classes/productshort';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ProductWarehouseReportService } from '../product-warehouse-report.service';

@Component({
  selector: 'app-product-warehouse-item',
  templateUrl: './product-warehouse-item.component.html',
  styleUrls: ['./product-warehouse-item.component.scss']
})
export class ProductWarehouseItemComponent extends BaseComponent implements  OnInit, OnChanges {
  @Input() warehouse: Product;
  warehouseInventory: ProductShort[] = [];
  isLoading = false;
  displayedColumns: string[] = ['name','stock'];

  constructor(private productWarehouseReportService: ProductWarehouseReportService,public translationService:TranslationService) {
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
    this.productWarehouseReportService.getProductWarehouse(this.warehouse.id)
      .subscribe((data: ProductShort[]) => {
        this.isLoading = false;
        this.warehouseInventory = data;
      }, () => this.isLoading = false)
  }

}
