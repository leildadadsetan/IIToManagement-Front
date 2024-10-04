import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { City } from '@core/domain-classes/city';
import { CityResourceParameter } from '@core/domain-classes/city-resource-parameter';
import { Country } from '@core/domain-classes/country';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CityService } from '../city.service';
import { ManageCityComponent } from '../manage-city/manage-city.component';
import { CityDataSource } from './city-datasource';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})

export class CityListComponent extends BaseComponent implements OnInit {
  dataSource: CityDataSource;
  cities: City[] = [];
  displayedColumns: string[] = ['action', 'cityName', 'countryName'];
  columnsToDisplay: string[] = ["footer"];
  countryList: Country[] = [];
  filteredCountryList: Observable<Country[]>;
  countryControl = new UntypedFormControl();
  cityResource: CityResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _countrynameFilter: string;
  _countryFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `cityName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get CountryNameFilter(): string {
    return this._countrynameFilter;
  }

  public set CountryNameFilter(v: string) {
    this._countrynameFilter = v;
    const countrynameFilter = `countryName##${v}`;
    this.filterObservable$.next(countrynameFilter);
  }
  public get CountryFilter(): string {
    return this._countryFilter;
  }

  public set CountryFilter(v: string) {
    this._countryFilter = v;
    const countryFilter = `country##${v}`;
    this.filterObservable$.next(countryFilter);
  }

  constructor(private cityService: CityService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {
    super(translationService);
    this.getLangDir();
    this.cityResource = new CityResourceParameter();
    this.cityResource.pageSize = 10;
    this.cityResource.orderBy = 'cityName asc'
  }

  ngOnInit(): void {
    this.dataSource = new CityDataSource(this.cityService);
    this.dataSource.loadData(this.cityResource);
    this.getResourceParameter();
    this.getCountries();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.cityResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'cityName') {
          this.cityResource.cityName = strArray[1];

        } else if (strArray[0] === 'country') {
          this.cityResource.countryName = strArray[1];
        }
        this.dataSource.loadData(this.cityResource);
      });
    this.filteredCountryList = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value)),
    );
  }

  private _filterCountry(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryList.filter(option => option.countryName.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.cityResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.cityResource.pageSize = this.paginator.pageSize;
          this.cityResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.cityResource);
        })
      )
      .subscribe();
  }

  getCountries() {
    this.sub$.sink = this.commonService.getCountry().subscribe(c => this.countryList = c);
  }

  deleteCity(city: City) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${city.cityName}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.cityService.deleteCity(city.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('CITY_IS_DELETED.'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.cityResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.cityResource.pageSize = c.pageSize;
          this.cityResource.skip = c.skip;
          this.cityResource.totalCount = c.totalCount;
        }
      });
  }

  manageCity(city: City): void {
    let dialogRef = this.dialog.open(ManageCityComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, city)
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.dataSource.loadData(this.cityResource);
      }
    })
  }
}
