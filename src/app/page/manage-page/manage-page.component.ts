import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Page } from '@core/domain-classes/page';
import { PageService } from '@core/services/page.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrls: ['./manage-page.component.scss']
})
export class ManagePageComponent extends BaseComponent implements OnInit {
  pageForm: UntypedFormGroup;
  isEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManagePageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private pageService: PageService,
    private toastrServoce: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
    
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.pageForm.patchValue(this.data);
      this.isEdit = true;
    }
  }
  createForm() {
    this.pageForm = this.fb.group({
      name: ['', Validators.required],
      order: ['', [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePage(): void {
    if (!this.pageForm.valid) {
      this.pageForm.markAllAsTouched();
      return;
    }
    const page: Page = this.pageForm.value;
    if (this.data.id) {
      page.id = this.data.id;
      this.pageService.update(page).subscribe(d => {
        this.toastrServoce.success(this.translationService.getValue('PAGE_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.pageService.add(page).subscribe(() => {
        this.toastrServoce.success(this.translationService.getValue('PAGE_ADDED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
