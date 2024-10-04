import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { ExpenseCategoryService } from '@core/services/expense-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-expense-category',
  templateUrl: './manage-expense-category.component.html',
  styleUrls: ['./manage-expense-category.component.scss']
})
export class ManageExpenseCategoryComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  expenseCategoryForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageExpenseCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpenseCategory,
    private expenseCategoryService: ExpenseCategoryService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
   
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.expenseCategoryForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.expenseCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveExpenseCategory(): void {
    if (!this.expenseCategoryForm.valid) {
      this.expenseCategoryForm.markAllAsTouched();
      return;
    }
    const expenseCategory: ExpenseCategory = this.expenseCategoryForm.value;

    if (this.data.id) {
      this.expenseCategoryService.update(expenseCategory).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('EXPENSE_CATEGORY_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.expenseCategoryService.add(expenseCategory).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('EXPENSE_CATEGORY_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
