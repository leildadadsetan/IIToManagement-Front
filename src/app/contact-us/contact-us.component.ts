import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ContactUs } from '@core/domain-classes/contact-us';
import { ContactUsResource } from '@core/domain-classes/contact-us-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { ContactUsDataSource } from './contact-us-datasource';
import { ContactUsDetailComponent } from './contact-us-detail/contact-us-detail.component';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent extends BaseComponent implements OnInit {

  dataSource: ContactUsDataSource;
  contactUsList: ContactUs[] = [];
  displayedColumns: string[] = ['action', 'createdDate', 'name', 'email', 'phone'];
  columnsToDisplay: string[] = ['footer'];
  isLoadingResults = true;
  contactUsResource: ContactUsResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _emailFilter: string;
  _mobileNoFilter: string;
  _cityFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email:${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get PhoneFilter(): string {
    return this._mobileNoFilter;
  }

  public set PhoneFilter(v: string) {
    this._mobileNoFilter = v;
    const mobileOrFilter = `phone:${v}`;
    this.filterObservable$.next(mobileOrFilter);
  }

  public get CityFilter(): string {
    return this._cityFilter;
  }

  public set CityFilter(v: string) {
    this._cityFilter = v;
    const cityFilter = `cityName:${v}`;
    this.filterObservable$.next(cityFilter);
  }

  constructor(
    private contactUsService: ContactUsService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog
  ) {
    super(translationService);
    this.getLangDir();
    this.contactUsResource = new ContactUsResource();
    this.contactUsResource.pageSize = 10;
    this.contactUsResource.orderBy = 'createdDate desc'
  }

  ngOnInit(): void {

    this.dataSource = new ContactUsDataSource(this.contactUsService);
    this.dataSource.loadData(this.contactUsResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.contactUsResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'name') {
          this.contactUsResource.name = escape(strArray[1]);
        } else if (strArray[0] === 'email') {
          this.contactUsResource.email = strArray[1];
        } else if (strArray[0] === 'phone') {
          this.contactUsResource.phone = strArray[1];
        }
        this.dataSource.loadData(this.contactUsResource);
      });
  }

  ngAfterViewInit() {
    this.sub$.sink = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.contactUsResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.contactUsResource.pageSize = this.paginator.pageSize;
          this.contactUsResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.contactUsResource);
        })
      )
      .subscribe();
  }

  deleteContactUs(contactUs: ContactUs) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.contactUsService.delectContactUs(contactUs.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('CONTACT_US_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.contactUsResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.contactUsResource.pageSize = c.pageSize;
          this.contactUsResource.skip = c.skip;
          this.contactUsResource.totalCount = c.totalCount;
        }
      });
  }

  editContactUs(contactId: string) {
    this.router.navigate(['/contact', contactId])
  }
  viewDetail(contactUs: ContactUs): void {
    this.dialog.open(ContactUsDetailComponent, {
      minWidth: '800px',
      direction:this.langDir,
      data: Object.assign({}, contactUs)
    });
  }
}
