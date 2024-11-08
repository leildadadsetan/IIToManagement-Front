import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { GroupService } from '../group.service';
import { merge, Observable, Subject, of } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
import { Group } from '@core/domain-classes/group';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { GroupDataSource } from './group-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslationService } from '@core/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupListComponent extends BaseComponent implements OnInit {
  dataSource: GroupDataSource;
  displayedColumns: string[] = ['action', 'groupName', 'isActive'];
  groupResource: GroupResourceParameter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _nameFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();
  expandedElement: Group | null;
  
  // This property has been added as per the error in your HTML template
  isLoadingResults: boolean = false;

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `groupName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    super(translationService);
    this.getLangDir();
    this.groupResource = new GroupResourceParameter();
    this.groupResource.pageSize = 20;
    this.groupResource.orderBy = 'groupName asc';
  }

  ngOnInit(): void {
    this.dataSource = new GroupDataSource(this.groupService);
    this.loadData();

    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((filterString) => {
        this.groupResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = filterString.split('##');
        if (strArray[0] === 'groupName') {
          this.groupResource.groupName = strArray[1]; // Ensure API handles this correctly
          this.loadData();
        }
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.groupResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.groupResource.pageSize = this.paginator.pageSize;
          this.groupResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.loadData();
        })
      )
      .subscribe();
  }

  loadData() {
    this.isLoadingResults = true; // Setting loading state
    this.dataSource.loadData(this.groupResource);
    this.isLoadingResults = false; // Reset loading state after fetching data
  }

  deleteGroup(group: Group) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${group.groupName}`)
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.sub$.sink = this.groupService.deleteGroup(group.id)
            .pipe(
              catchError(error => {
                this.toastrService.error(this.translationService.getValue('ERROR_DELETING_GROUP'));
                return of(null); // Handle error and return null
              })
            )
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('GROUP_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.loadData();
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((header: ResponseHeader) => {
        if (header) {
          this.groupResource.pageSize = header.pageSize;
          this.groupResource.skip = header.skip;
          this.groupResource.totalCount = header.totalCount;
        }
      });
  }

  editGroup(groupId: string) {
    this.router.navigate(['/group', groupId]);
  }

  toggleRow(group: Group) {
    this.expandedElement = this.expandedElement === group ? null : group;
    this.cd.detectChanges();
  }
}
