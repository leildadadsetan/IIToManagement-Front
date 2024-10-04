import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Country } from '@core/domain-classes/country';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageCountryComponent } from '../manage-country/manage-country.component';

@Component({
  selector: 'app-country-list-presentation',
  templateUrl: './country-list-presentation.component.html',
  styleUrls: ['./country-list-presentation.component.scss']
})
export class CountryListPresentationComponent extends BaseComponent {

  @Input() set countries(value: Country[]) {
    this.dataSource = new MatTableDataSource<Country>(value);
    this.dataSource.paginator = this.paginator;
  };

  @Input() loading: boolean = false;
  @Output() deleteCountryHandler: EventEmitter<string> = new EventEmitter<string>();
  dataSource = new MatTableDataSource<Country>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['action', 'countryName'];
  footerToDisplayed = ['footer'];

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  deleteCountry(country: Country): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${country.countryName}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteCountryHandler.emit(country.id);
        }
      });
  }

  manageCountry(country: Country): void {
    this.dialog.open(ManageCountryComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, country)
    });
  }
}
