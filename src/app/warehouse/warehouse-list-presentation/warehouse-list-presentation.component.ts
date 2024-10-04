import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Warehouse } from '@core/domain-classes/warehouse';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageWarehouseComponent } from '../manage-warehouse/manage-warehouse.component';


@Component({
  selector: 'app-warehouse-list-presentation',
  templateUrl: './warehouse-list-presentation.component.html',
  styleUrls: ['./warehouse-list-presentation.component.scss']
})
export class WarehouseListPresentationComponent extends BaseComponent implements OnInit {

  columnsToDisplay: string[] = ["footer"];
  // @Input() warehouses: Warehouse[];
  @Input() set warehouses(value: Warehouse[]) {
    this.dataSource = new MatTableDataSource<Warehouse>(value);
    this.dataSource.paginator = this.paginator;
  };

  dataSource = new MatTableDataSource<Warehouse>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() loading: boolean = false;
  @Output() deleteWarehousesHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name','contactPerson','mobileNumber','email'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }


  ngOnInit(): void {
  }

  deleteWarehouse(warehouse: Warehouse): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${warehouse.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteWarehousesHandler.emit(warehouse.id);
        }
      });
  }

  manageWarehouse(warehouse: Warehouse): void {
    this.dialog.open(ManageWarehouseComponent, {
      width: '60vw',
      direction:this.langDir,
      data: Object.assign({}, warehouse)
    });
  }

}
