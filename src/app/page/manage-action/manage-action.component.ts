import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/base.component';
import { Action } from '@core/domain-classes/action';
import { ActionService } from '@core/services/action.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-action',
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.scss']
})
export class ManageActionComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  actionForm: UntypedFormGroup;
  isDisabled = true;

  constructor(
    public dialogRef: MatDialogRef<ManageActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private actionService: ActionService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
    
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.actionForm.patchValue(this.data);
      this.isEdit = true;
    }
  }
  createForm() {
    this.actionForm = this.fb.group({
      pagename: [{ value: this.data.pagename, disabled: this.isDisabled }],
      name: ['', Validators.required],
      order: ['', [Validators.required]]
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  saveAction(): void {
    if (!this.actionForm.valid) {
      this.actionForm.markAllAsTouched();
      return;
    }
    const action: Action = this.actionForm.value;
    action.pageId = this.data.pageId;
    if (this.data.id) {
      action.id = this.data.id;
      this.actionService.update(action).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ACTION_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close(this.data);
      });
    } else {
      this.actionService.add(action).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ACTION_SAVED_SUCCESSFULLY'));
        this.dialogRef.close(this.data);
      });
    }
  }
}
