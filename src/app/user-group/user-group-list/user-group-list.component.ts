import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Group } from '@core/domain-classes/group';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { GroupService } from '@core/services/group.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { UserGroupService } from '../user-group.service';
import { UserGroupDataSource } from './user-group-datasource';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent extends BaseComponent implements OnInit {
  dataSource: UserGroupDataSource;
  groups: Group[] = [];
  displayedColumns: string[] = ['action', 'createdDate',  'groupCategoryId', 'createdBy'];
  footerToDisplayed = ['footer'];
  isLoadingResults = true;
  userGroupResource: GroupResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _referenceFilter: string;
  _categoryFilter: string;
  _userFilter: string;
  users: User[] = [];
  groupps: Group[] = [];

  public filterObservable$: Subject<string> = new Subject<string>();

  
 
 

  constructor(
    private userGroupService: UserGroupService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private groupService: GroupService,
    private userService: UserService) {
    super(translationService);
    this.getLangDir();
    this.userGroupResource = new GroupResourceParameter();
    this.userGroupResource.pageSize = 15;
    this.userGroupResource.orderBy = 'createdDate asc';
  }

  ngOnInit(): void {
    this.dataSource = new UserGroupDataSource(this.userGroupService);
    this.dataSource.loadData(this.userGroupResource);
    this.getResourceParameter();
    this.getGroups();
    this.getUsers();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.userGroupResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
          if (strArray[0] === 'groupCategoryId') {
          this.userGroupResource.id = strArray[1];
        }  
        this.dataSource.loadData(this.userGroupResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.userGroupResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.userGroupResource.pageSize = this.paginator.pageSize;
          this.userGroupResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.userGroupResource);
        })
      )
      .subscribe();
  }

  getGroups() {
    this.groupService.getAll().subscribe(categories => {
      this.groups = categories;
    })
  }

  getUsers() {
    let userResource = new UserResource();
    userResource.pageSize = 10;
    userResource.orderBy = 'firstName desc'
    this.sub$.sink = this.userService.getUsers(userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }

  deleteUserGroup(userGroup: Group) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.userGroupService.deleteUserGroup(userGroup.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('USERGROUP_DELETED_SUCCESSFULLY'));
              this.dataSource.loadData(this.userGroupResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.userGroupResource.pageSize = c.pageSize;
          this.userGroupResource.skip = c.skip;
          this.userGroupResource.totalCount = c.totalCount;
        }
      });
  }

  editUserGroup(groupId: string) {
    this.router.navigate(['/user-group/manage', groupId])
  }

 

 
}
