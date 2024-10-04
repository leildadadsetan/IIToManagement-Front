import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '@core/domain-classes/expense';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { ExpenseCategoryService } from '@core/services/expense-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.scss']
})
export class ManageExpenseComponent extends BaseComponent implements OnInit {
  expenseForm: UntypedFormGroup;
  users: User[] = [];
  expenseCategories: ExpenseCategory[] = [];
  isLoading = false;
  isReceiptDeleted = false;

  public get ReceiptName(): string {
    return this.expenseForm.get('receiptName').value;
  }
  constructor(private router: Router,
    private fb: UntypedFormBuilder,
    private expenseCategoryService: ExpenseCategoryService,
    private userService: UserService,
    private expenseService: ExpenseService,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private activatedRoute: ActivatedRoute) { 
      super(translationService);
    this.getLangDir();
    }

  ngOnInit(): void {
    this.createExpenseForm();
    this.getExpenseCategories();
    this.getUsers();
    this.activatedRoute.data.subscribe((data: { expense: Expense }) => {
      this.expenseForm.patchValue(data.expense);
    })
  }

  createExpenseForm() {
    this.expenseForm = this.fb.group({
      id: [''],
      reference: [''],
      expenseCategoryId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      expenseById: [''],
      description: [''],
      expenseDate: [new Date(), [Validators.required]],
      receiptName: [''],
      documentData: [],
      isReceiptChange: [false]
    });
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
    this.userService.getUsers(userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }

  removeReceipt() {
    this.expenseForm.get('isReceiptChange').setValue(true);
    this.expenseForm.get('documentData').setValue('');
    this.expenseForm.get('receiptName').setValue('');
  }

  fileEvent($event) {
    this.isReceiptDeleted = true;
    let files: File[] = $event.target.files;
    if (files.length == 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.expenseForm.get('documentData').setValue(reader.result.toString());
      this.expenseForm.get('receiptName').setValue(file.name);
      this.expenseForm.get('isReceiptChange').setValue(true);
    }
  }

  onExpenseSubmit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
    const expense: Expense = this.expenseForm.getRawValue();
    this.isLoading = true;
    if (expense.id) {
      this.expenseService.updateExpense(expense.id, expense).subscribe(data => {
        this.isLoading = false;
        this.toastrService.success(this.translationService.getValue('EXPENSE_SAVED_SUCCESSFULLY'))
        this.router.navigate(['expense']);
      }, () => this.isLoading = false);
    } else {
      this.expenseService.addExpense(expense).subscribe(data => {
        this.isLoading = false;
        this.toastrService.success(this.translationService.getValue('EXPENSE_SAVED_SUCCESSFULLY'))
        this.router.navigate(['expense']);
      }, () => this.isLoading = false);
    }
  }

  downloadReceipt() {
    const expenseId = this.expenseForm.get('id').value;
    if (!expenseId) return;
    this.expenseService.downloadReceipt(expenseId)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.downloadFile(event, this.ReceiptName);
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
}
