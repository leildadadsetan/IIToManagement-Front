import { Component, OnInit } from '@angular/core';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { ExpenseCategoryService } from '@core/services/expense-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-expense-category-list',
  templateUrl: './expense-category-list.component.html',
  styleUrls: ['./expense-category-list.component.scss']
})
export class ExpenseCategoryListComponent extends BaseComponent implements OnInit {
  expenseCategories$: Observable<ExpenseCategory[]>;
  loading$: Observable<boolean>;
  constructor(
    private expenseCategoryService: ExpenseCategoryService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
  }
  ngOnInit(): void {

    this.loading$ = this.expenseCategoryService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getExpenseCategories();
          }
        })
      )
    this.expenseCategories$ = this.expenseCategoryService.entities$
  }

  getExpenseCategories(): void {
    this.expenseCategoryService.getAll();
  }

  deleteExpenseCategory(id: string): void {
    this.sub$.sink = this.expenseCategoryService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('EXPENSE_CATEGORY_DELETED_SUCCESSFULLY'));
    });
  }
}
