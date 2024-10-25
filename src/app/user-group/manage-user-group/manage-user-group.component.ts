import { Component, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserGroup } from '@core/domain-classes/user-group';
import { UserGroupService } from '../user-group.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-manage-user-group',
  templateUrl: './manage-user-group.component.html',
  styleUrls: ['./manage-user-group.component.scss']
})
export class ManageUserGroupComponent extends BaseComponent implements OnInit {
  userGroup: UserGroup;
  userGroupForm: UntypedFormGroup;
  isEditMode = false;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userGroupService: UserGroupService,
    private toastrService: ToastrService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createUserGroupForm();
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { userGroup: UserGroup }) => {
        if (data.userGroup) {
          this.isEditMode = true;
          this.userGroupForm.patchValue(data.userGroup);
          this.userGroup = data.userGroup;
        }
      }
    );
  }

  createUserGroupForm() {
    this.userGroupForm = this.fb.group({
      id: [''],
      groupName: ['', [Validators.required]],
      isActive: [true]
    });
  }

  saveUserGroup() {
    if (this.userGroupForm.valid) {
      const userGroup = this.createBuildObject();
      if (this.isEditMode) {
        this.sub$.sink = this.userGroupService.updateUserGroup(userGroup).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('USER_GROUP_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/user-groups']);
        });
      } else {
        this.sub$.sink = this.userGroupService.addUserGroup(userGroup).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('USER_GROUP_CREATED_SUCCESSFULLY'));
          this.router.navigate(['/user-groups']);
        });
      }
    } else {
      this.userGroupForm.markAllAsTouched();
    }
  }

  createBuildObject(): UserGroup {
    const formValue = this.userGroupForm.value;
    const userGroup: UserGroup = {
      id: formValue.id,
      name: formValue.name,
      isActive: formValue.isActive
    };
    return userGroup;
  }
}
 