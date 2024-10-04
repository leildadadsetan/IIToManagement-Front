import {animate,state,style, transition, trigger} from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { WarehouseStockReportService } from './warehouse-stock-report.service';
import { Warehouse } from '@core/domain-classes/warehouse';

@Component({
  selector: 'app-warehouse-stock-report',
  templateUrl: './warehouse-stock-report.component.html',
  styleUrls: ['./warehouse-stock-report.component.scss'],
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
  providers: [UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe],
})
export class WarehouseStockReportComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['action', 'name', 'contactPerson','mobileNumber','email'];
  expandedElement: SalesOrder | null;
  waehouseList: Warehouse[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    public translationService: TranslationService,
    private warehouseStockReportService: WarehouseStockReportService,
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getWarehouse();
  }

  getWarehouse() {
    return this.warehouseStockReportService.getWarehouses().subscribe(
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
