import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '@core/domain-classes/group';
import { GroupService } from '@core/services/group.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.scss']
})
export class ManageGroupComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  groupForm: UntypedFormGroup;
  imgSrc: any = null;
  isImageUpload: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManageGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group,
    private groupService: GroupService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.groupForm.patchValue(this.data);
      this.isEdit = true;
     
    }
    else {
      this.imgSrc = '';
    }
  }

  createForm() {
    this.groupForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

 
  onCancel(): void {
    this.dialogRef.close();
  }

  saveGroup(): void {
    if (!this.groupForm.valid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    const group: Group = this.groupForm.value;
  
    if (this.data.id) {
      this.groupService.update(group).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('GROUP_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.groupService.add(group).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('GROUP_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
