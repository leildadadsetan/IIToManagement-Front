import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupCategory } from '@core/domain-classes/group-category';
import { GroupCategoryService } from '@core/services/group-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-group-category',
  templateUrl: './manage-group-category.component.html',
  styleUrls: ['./manage-group-category.component.scss']
})
export class ManageGroupCategoryComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  groupCategoryForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageGroupCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupCategory,
    private groupCategoryService: GroupCategoryService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
   
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.groupCategoryForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.groupCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveGroupCategory(): void {
    if (!this.groupCategoryForm.valid) {
      this.groupCategoryForm.markAllAsTouched();
      return;
    }
    const groupCategory: GroupCategory = this.groupCategoryForm.value;

    if (this.data.id) {
      this.groupCategoryService.update(groupCategory).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('GROUP_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.groupCategoryService.add(groupCategory).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('GROUP_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
