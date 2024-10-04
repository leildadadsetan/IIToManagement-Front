import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageExpenseCategoryComponent } from '../manage-expense-category/manage-expense-category.component';

@Component({
  selector: 'app-expense-category-list-presentation',
  templateUrl: './expense-category-list-presentation.component.html',
  styleUrls: ['./expense-category-list-presentation.component.scss']
})
export class ExpenseCategoryListPresentationComponent extends BaseComponent implements OnInit {

  @Input() expenseCategories: ExpenseCategory[];
  @Input() loading: boolean = false;
  @Output() deleteExpenseCategoryHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  deleteExpenseCategory(expenseCategory: ExpenseCategory): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${expenseCategory.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteExpenseCategoryHandler.emit(expenseCategory.id);
        }
      });
  }

  manageExpenseCategory(expenseCategory: ExpenseCategory): void {
    this.dialog.open(ManageExpenseCategoryComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, expenseCategory)
    });
  }
}
