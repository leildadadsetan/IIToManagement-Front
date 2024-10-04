import { Component, OnInit } from '@angular/core';
import { Warehouse } from '@core/domain-classes/warehouse';
import { TranslationService } from '@core/services/translation.service';
import { WarehouseService } from '@core/services/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent extends BaseComponent implements OnInit {

  warehouses$: Observable<Warehouse[]>;
  loading$: Observable<boolean>;
  constructor(
    private warehouseService: WarehouseService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {

    this.loading$ = this.warehouseService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getWarehouse();
          }
        })
      )
    this.warehouses$ = this.warehouseService.entities$
  }

  getWarehouse(){
    this.warehouseService.getAll();
  }

  deleteWarehouse(id: string): void {
    this.sub$.sink = this.warehouseService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('WAREHOUSE_DELETED_SUCCESSFULLY'));
    });
  }

}
