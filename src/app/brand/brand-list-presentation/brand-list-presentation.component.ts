import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Brand } from '@core/domain-classes/brand';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';
import { ManageBrandComponent } from '../manage-brand/manage-brand.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-brand-list-presentation',
  templateUrl: './brand-list-presentation.component.html',
  styleUrls: ['./brand-list-presentation.component.scss']
})
export class BrandListPresentationComponent extends BaseComponent {
  @Input() set brands(value: Brand[]) {
    this.dataSource = new MatTableDataSource<Brand>(value);
    this.dataSource.paginator = this.paginator;
  };

  @Input() loading: boolean = false;
  @Output() deleteBrandHandler: EventEmitter<string> = new EventEmitter<string>();
  dataSource = new MatTableDataSource<Brand>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['action', 'imageUrl', 'name'];
  footerToDisplayed = ['footer'];
  baseUrl = environment.apiUrl;

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  deleteBrand(brand: Brand): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${brand.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteBrandHandler.emit(brand.id);
        }
      });
  }

  manageBrand(brand: Brand): void {
    this.dialog.open(ManageBrandComponent, {
      width: '110vh',
      direction:this.langDir,
      data: Object.assign({}, brand)
    });
  }

}
