import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserGroupResource } from '@core/domain-classes/user-group-resource';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UserGroupService } from '../user-group.service';
import { UserGroupDataSource } from './user-group-datasource';
import { UserGroup } from '@core/domain-classes/user-group';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent extends BaseComponent implements OnInit, AfterViewInit {
  dataSource: UserGroupDataSource;
  users: User[] = [];
  displayedColumns: string[] = ['name',  'isActive'];
  footerToDisplayed = ['footer'];
  isLoadingResults = true;
  userGroupResource: UserGroupResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private userGroupService: UserGroupService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
    this.userGroupResource = new UserGroupResource();
    this.userGroupResource.pageSize = 10;
    this.userGroupResource.orderBy = 'name'
  }

  ngOnInit(): void {
    this.dataSource = new UserGroupDataSource(this.userGroupService);
    this.dataSource.loadUserGroups(this.userGroupResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.userGroupResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.userGroupResource.pageSize = this.paginator.pageSize;
          this.userGroupResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadUserGroups(this.userGroupResource);
        })
      )
      .subscribe();

    this.sub$.sink = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.userGroupResource.name = this.input.nativeElement.value;
          this.dataSource.loadUserGroups(this.userGroupResource);
        })
      )
      .subscribe();
  }

  deleteUser(usergroup: UserGroup) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${usergroup.name}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.userGroupService.deleteUserGroup(usergroup.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('USERGROUP_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.userGroupResource.name = this.input.nativeElement.value;
              this.dataSource.loadUserGroups(this.userGroupResource);
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

  editUserGroup(userGroupId: string) {
    this.router.navigate(['/usergroups/manage', userGroupId])
  }


}
