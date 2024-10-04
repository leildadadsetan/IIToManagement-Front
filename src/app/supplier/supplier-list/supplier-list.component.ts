import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Country } from '@core/domain-classes/country';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from '../supplier.service';
import { SupplierDataSource } from './supplier-datasource';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SupplierListComponent extends BaseComponent implements OnInit {
  dataSource: SupplierDataSource;
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['action', 'supplierName', 'email', 'mobileNo', 'country', 'website'];
  columnsToDisplay: string[] = ["footer"];
  countryList: Country[] = [];
  filteredCountryList: Observable<Country[]>;
  countryControl = new UntypedFormControl();
  isLoadingResults = true;
  supplierResource: SupplierResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _emailFilter: string;
  _mobileOrPhoneFilter: string;
  _websiteFilter: string;
  _countryFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();
  expandedElement: Supplier | null;

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `supplierName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get WebsiteFilter(): string {
    return this._websiteFilter;
  }

  public get CountryFilter(): string {
    return this._countryFilter;
  }

  public set CountryFilter(v: string) {
    this._countryFilter = v;
    const countryFilter = `country##${v}`;
    this.filterObservable$.next(countryFilter);
  }

  public set WebsiteFilter(v: string) {
    this._websiteFilter = v;
    const websiteFilter = `website##${v}`;
    this.filterObservable$.next(websiteFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email##${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileOrPhoneFilter(): string {
    return this._mobileOrPhoneFilter;
  }

  public set MobileOrPhoneFilter(v: string) {
    this._mobileOrPhoneFilter = v;
    const mobileOrFilter = `mobileNo##${v}`;
    this.filterObservable$.next(mobileOrFilter);
  }

  constructor(
    private supplierService: SupplierService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cd: ChangeDetectorRef) {
    super(translationService);
    this.getLangDir();
    this.supplierResource = new SupplierResourceParameter();
    this.supplierResource.pageSize = 10;
    this.supplierResource.orderBy = 'supplierName asc'
  }

  ngOnInit(): void {
    this.dataSource = new SupplierDataSource(this.supplierService);
    this.dataSource.loadData(this.supplierResource);
    this.getResourceParameter();
    this.getCountries();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.supplierResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'supplierName') {
          this.supplierResource.supplierName = escape(strArray[1]);
        } else if (strArray[0] === 'email') {
          this.supplierResource.email = strArray[1];
        } else if (strArray[0] === 'mobileNo') {
          this.supplierResource.mobileNo = strArray[1];
        } else if (strArray[0] === 'website') {
          this.supplierResource.website = encodeURI(strArray[1].trim());
        } else if (strArray[0] === 'country') {
          this.supplierResource.country = strArray[1];
        }
        this.dataSource.loadData(this.supplierResource);
      });

    this.filteredCountryList = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountryForAutoComplete(value)),
    );
  }

  private _filterCountryForAutoComplete(value: string) {
    const filterValue = value.toLowerCase();
    return this.countryList.filter(country => country.countryName.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.supplierResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.supplierResource.pageSize = this.paginator.pageSize;
          this.supplierResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.supplierResource);
        })
      )
      .subscribe();
  }

  getCountries() {
    this.sub$.sink = this.commonService.getCountry().subscribe(c => this.countryList = c);
  }

  deleteSupplier(supplier: Supplier) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${supplier.supplierName}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.supplierService.deleteSupplier(supplier.id)
            .subscribe(() => {
              this.toastrService.success('Supplier is deleted.');
              this.paginator.pageIndex = 0;
              //this.supplierResource.name = this.input.nativeElement.value;
              this.dataSource.loadData(this.supplierResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.supplierResource.pageSize = c.pageSize;
          this.supplierResource.skip = c.skip;
          this.supplierResource.totalCount = c.totalCount;
        }
      });
  }

  editSupplier(supplierId: string) {
    this.router.navigate(['/supplier/manage', supplierId])
  }

  toggleRow(supplier: Supplier) {
    this.expandedElement = this.expandedElement === supplier ? null : supplier;
    this.cd.detectChanges();
  }

}
