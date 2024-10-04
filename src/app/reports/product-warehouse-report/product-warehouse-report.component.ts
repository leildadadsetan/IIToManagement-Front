import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '@core/domain-classes/product';
import { ProductShort } from '@core/domain-classes/productshort';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ProductWarehouseReportService } from './product-warehouse-report.service';

@Component({
  selector: 'app-product-warehouse-report',
  templateUrl: './product-warehouse-report.component.html',
  styleUrls: ['./product-warehouse-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProductWarehouseReportComponent extends BaseComponent implements OnInit
{
  displayedColumns: string[] = ['action', 'name', 'stock'];
  expandedElement: SalesOrder | null;
  products: Product[] = [];
  waehouseList: ProductShort[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    public translationService: TranslationService,
    private productWarehouseReportService: ProductWarehouseReportService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getWarehouseProduct();
  }

  getWarehouseProduct() {
    return this.productWarehouseReportService.getWarehouseProduct().subscribe(
      (resp) => {
        if (resp) {
          this.waehouseList = resp;
        }
      },
      (err) => {}
    );
  }

  toggleRow(element: SalesOrder) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }
}
