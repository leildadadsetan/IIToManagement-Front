import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ApplicationEnums } from '@core/domain-classes/application.enum';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryResourceParameter } from '@core/domain-classes/inquiry-resource-parameter';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { ModuleReference } from '@core/domain-classes/module-reference';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { InquirySourceService } from '@core/services/inquiry-source.service';
import { InquiryStatusService } from '@core/services/inquiry-status.service';
import { TranslationService } from '@core/services/translation.service';
import { AddReminderSchedulerComponent } from '@shared/add-reminder-scheduler/add-reminder-scheduler.component';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { InquiryService } from '../inquiry.service';
import { InquiryDataSource } from './inquiry-datasource';
import { InquiryProductListComponent } from './inquiry-product-list/inquiry-product-list.component';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss']
})
export class InquiryListComponent extends BaseComponent implements OnInit {
  dataSource: InquiryDataSource;
  inquiries: Inquiry[] = [];
  displayedColumns: string[] = ['action', 'createdDate', 'companyName', 'status', 'source', 'assignTo', 'email', 'mobileNo', 'cityName', 'taskCount', 'commentCount', 'attachmentCount'];
  footerToDisplayed = ['footer'];
  isLoadingResults = true;
  inquiryResource: InquiryResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _companyNameFilter: string;
  _emailFilter: string;
  _mobileNoFilter: string;
  _cityFilter: string;
  _assignToFilter: string;
  _statusToFilter: string;
  _sourceToFilter: string;
  inquiryStatuses: InquiryStatus[] = [];
  users: User[] = [];
  public sourcesOfInquiry: InquirySource[] = [];

  public filterObservable$: Subject<string> = new Subject<string>();

  public get CompanyNameFilter(): string {
    return this._companyNameFilter;
  }

  public set CompanyNameFilter(v: string) {
    this._companyNameFilter = v;
    const companyNameFilter = `companyName:${v}`;
    this.filterObservable$.next(companyNameFilter);
  }

  public get SourceFilter(): string {
    return this._sourceToFilter;
  }

  public set SourceFilter(v: string) {
    this._sourceToFilter = v ? v : '';
    const sourceToFilter = `Source:${this._sourceToFilter}`;
    this.filterObservable$.next(sourceToFilter);
  }

  public set StatusToFilter(v: string) {
    this._statusToFilter = v ? v : '';
    const statusToFilter = `Status:${this._statusToFilter}`;
    this.filterObservable$.next(statusToFilter);
  }
  public get StatusToFilter(): string {
    return this._statusToFilter;
  }

  public set AssignToFilter(v: string) {

    this._assignToFilter = v ? v : '';
    const assignToFilter = `AssignTo:${this._assignToFilter}`;
    this.filterObservable$.next(assignToFilter);
  }
  public get AssignToFilter(): string {
    return this._assignToFilter;
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email:${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileNoFilter(): string {
    return this._mobileNoFilter;
  }

  public set MobileNoFilter(v: string) {
    this._mobileNoFilter = v;
    const mobileOrFilter = `mobileNo:${v}`;
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
  userResource: UserResource;

  constructor(
    private inquiryService: InquiryService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private userService: UserService,
    private inquiryStatusService: InquiryStatusService,
    private inquirySourceService: InquirySourceService) {
    super(translationService);
    this.getLangDir();
    this.inquiryResource = new InquiryResourceParameter();
    this.inquiryResource.pageSize = 15;
    this.inquiryResource.orderBy = 'createdDate asc';
    this.userResource = new UserResource();
    this.userResource.pageSize = 10;
    this.userResource.orderBy = 'firstName desc'
  }

  ngOnInit(): void {
    this.dataSource = new InquiryDataSource(this.inquiryService);
    this.dataSource.loadData(this.inquiryResource);
    this.getResourceParameter();
    this.getInuiriesStatus();
    this.getInquirySource();
    this.getUsers();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.inquiryResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'companyName') {
          this.inquiryResource.companyName = escape(strArray[1]);
        } else if (strArray[0] === 'email') {
          this.inquiryResource.email = strArray[1];
        } else if (strArray[0] === 'mobileNo') {
          this.inquiryResource.mobileNo = strArray[1];
        } else if (strArray[0] === 'cityName') {
          this.inquiryResource.city = strArray[1];
        }
        else if (strArray[0] === 'AssignTo') {
          this.inquiryResource.assignTo = strArray[1];
        }
        else if (strArray[0] === 'Source') {
          this.inquiryResource.inquirySourceId = strArray[1];
        }
        else if (strArray[0] === 'Status') {
          this.inquiryResource.inquiryStatusId = strArray[1];
        }
        this.dataSource.loadData(this.inquiryResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.inquiryResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.inquiryResource.pageSize = this.paginator.pageSize;
          this.inquiryResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.inquiryResource);
        })
      )
      .subscribe();
  }


  getUsers() {
    this.sub$.sink = this.userService.getUsers(this.userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }

  getInuiriesStatus() {
    this.sub$.sink = this.inquiryStatusService.getAll()
      .subscribe(c => {
        this.inquiryStatuses = c;
      })
  }

  getInquirySource() {
    this.inquirySourceService.getAll()
      .subscribe(c => this.sourcesOfInquiry = c);
  }

  deleteInquiry(inquiry: Inquiry) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.inquiryService.deleteInquiry(inquiry.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('INQUIRY_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.inquiryResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.inquiryResource.pageSize = c.pageSize;
          this.inquiryResource.skip = c.skip;
          this.inquiryResource.totalCount = c.totalCount;
        }
      });
  }

  addReminder(inquiryId: string) {
    const moduleReference: ModuleReference = {
      application: ApplicationEnums.Inquiry,
      referenceId: inquiryId
    };
    this.dialog.open(AddReminderSchedulerComponent, {
      minWidth: '800px',
      direction:this.langDir,
      data: Object.assign({}, moduleReference)
    });
  }

  editInquiry(inquiryId: string) {
    this.router.navigate(['/inquiry/manage', inquiryId])
  }

  viewProduct(inquiry: Inquiry): void {
    this.dialog.open(InquiryProductListComponent, {
      minWidth: '800px',
      direction:this.langDir,
      data: Object.assign({}, inquiry)
    });
  }
}
