import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Expense } from '@core/domain-classes/expense';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { ExpenseResourceParameter } from '@core/domain-classes/expense-source-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { dateCompare } from '@core/services/date-range';
import { ExpenseCategoryService } from '@core/services/expense-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { ExpenseService } from '../../expense/expense.service';
import { ExpenseReportDataSource } from './expense-report.datasource';
import * as XLSX from 'xlsx';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';



@Component({
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss'],
  providers:[UTCToLocalTime, CustomCurrencyPipe]
})
export class ExpenseReportComponent extends BaseComponent implements OnInit {
  dataSource: ExpenseReportDataSource;
  expenses: Expense[] = [];
  displayedColumns: string[] = ['action', 'createdDate', 'expenseDate', 'amount', 'reference', 'expenseCategoryId', 'expenseBy'];
  footerToDisplayed = ['footer'];
  totalAmountDisplayed=['totalAmountLabel','totalAmount']
  isLoadingResults = true;
  expenseResource: ExpenseResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _referenceFilter: string;
  _categoryFilter: string;
  _userFilter: string;
  users: User[] = [];
  expenseCategories: ExpenseCategory[] = [];
  searchForm: UntypedFormGroup;
  totalAmount: number=0;


  public filterObservable$: Subject<string> = new Subject<string>();

  public get ReferenceFilter(): string {
    return this._referenceFilter;
  }

  public set ReferenceFilter(v: string) {
    this._referenceFilter = v;
    const referenceFilter = `reference:${v}`;
    this.filterObservable$.next(referenceFilter);
  }

  public get CategoryFilter(): string {
    return this._categoryFilter;
  }

  public set CategoryFilter(v: string) {
    this._categoryFilter = v;
    const categoryFilter = `expenseCategoryId:${v}`;
    this.filterObservable$.next(categoryFilter);
  }

  public get UserFilter(): string {
    return this._userFilter;
  }

  public set UserFilter(v: string) {
    this._userFilter = v ? v : '';
    const expenseById = `expenseById:${this._userFilter}`;
    this.filterObservable$.next(expenseById);
  }
  currentDate: Date=new Date();

  constructor(
    private expenseService: ExpenseService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    public translationService: TranslationService,
    private expenseCategoryService: ExpenseCategoryService,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,
    ) {
    super(translationService);
    this.getLangDir();
    this.expenseResource = new ExpenseResourceParameter();
    this.expenseResource.pageSize = 15;
    this.expenseResource.orderBy = 'createdDate asc';
  }

  ngOnInit(): void {
    this.createSearchFormGroup();
    this.dataSource = new ExpenseReportDataSource(this.expenseService);
    this.dataSource.loadData(this.expenseResource);
    this.getResourceParameter();
    this.getExpenseCategories();
    this.getUsers();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.expenseResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'reference') {
          this.expenseResource.reference = strArray[1];
        } else if (strArray[0] === 'expenseCategoryId') {
          this.expenseResource.expenseCategoryId = strArray[1];
        } else if (strArray[0] === 'expenseById') {
          this.expenseResource.expenseById = strArray[1];
        }
        this.dataSource.loadData(this.expenseResource);
      });
  }


  createSearchFormGroup(){
    this.searchForm= this.fb.group({
      fromDate:[''],
      toDate:['']
    },{
      validators: dateCompare()
    });
  }

  onSearch(){
   if( this.searchForm.valid){
    this.expenseResource.fromDate= this.searchForm.get('fromDate').value;
    this.expenseResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.expenseResource);
   }
  }

  onClear(){
    this.searchForm.reset();
    this.expenseResource.fromDate= this.searchForm.get('fromDate').value;
    this.expenseResource.toDate= this.searchForm.get('toDate').value;
    this.dataSource.loadData(this.expenseResource);
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.expenseResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.expenseResource.pageSize = this.paginator.pageSize;
          this.expenseResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.expenseResource);
        })
      )
      .subscribe();
  }

  getExpenseCategories() {
    this.expenseCategoryService.getAll().subscribe(categories => {
      this.expenseCategories = categories;
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

  deleteExpense(expense: Expense) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.expenseService.deleteExpense(expense.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('EXPENSE_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.expenseResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.expenseResource.pageSize = c.pageSize;
          this.expenseResource.skip = c.skip;
          this.expenseResource.totalCount = c.totalCount;
          this.totalAmount= c.totalAmount;
        }
      });
  }

  editExpense(expenseId: string) {
    this.router.navigate(['/expense/manage', expenseId])
  }

  downloadReceipt(expense: Expense) {
    this.sub$.sink = this.expenseService.downloadReceipt(expense.id)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.downloadFile(event, expense.receiptName);
          }
        },
        (error) => {
          this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
        }
      );
  }

  private downloadFile(data: HttpResponse<Blob>, name: string) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  onDownloadReport() {
    this.expenseService.getExpensesReport(this.expenseResource)
    .subscribe((c: HttpResponse<Expense[]>)=>{
      this.expenses= [...c.body];
      let heading=[[ this.translationService.getValue('EXPENSE_DATE'), this.translationService.getValue('AMOUNT'), this.translationService.getValue('REFERENCE'), this.translationService.getValue('EXPENSE_CATEGORY'), this.translationService.getValue('EXPENSE_BY')]];

      let expensesReport= [];
      this.expenses.forEach((expense: Expense)=>{
          expensesReport.push({
            'expenseDate':   this.utcToLocalTime.transform(expense.expenseDate,'shortDate'),
            'amount': this.customCurrencyPipe.transform(expense.amount),
            'reference': expense.reference,
            'category': expense.expenseCategory.name,
            'expenseBy': expense? `${expense.expenseBy?.firstName?expense.expenseBy?.firstName:''} ${expense.expenseBy?.lastName?expense.expenseBy?.lastName:''}`:''
          });
      });

      let workBook= XLSX.utils.book_new();
      XLSX.utils.sheet_add_aoa(workBook,heading);
      let workSheet= XLSX.utils.sheet_add_json(workBook, expensesReport, {origin: "A2", skipHeader:true });
      XLSX.utils.book_append_sheet(workBook,workSheet,this.translationService.getValue('EXPENSE_REPORT'));
      XLSX.writeFile(workBook,this.translationService.getValue('EXPENSE_REPORT') + ".xlsx");
    });


  }
}
