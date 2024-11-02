import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '@core/domain-classes/group';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { GroupService } from '../group.service';
import { EditorConfig } from '@shared/editor.config';

export class AlreadyExistValidator {
  static exist(flag: boolean): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (flag) {
        return { exist: true };
      }
      return null;
    };
  }
}

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent extends BaseComponent implements OnInit {

  groupForm: UntypedFormGroup;
  imgSrc: any = null;
  isImageUpload: boolean = false;
  group: Group;
  editorConfig = EditorConfig;

  constructor(
    private fb: UntypedFormBuilder,
    private groupService: GroupService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    public translationService: TranslationService,
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createGroupForm();
    const routeSub$ = this.route.data.subscribe(
      (data: { group: Group }) => {
        if (data.group) {
          this.group = { ...data.group };
       
          this.patchGroup();
        } else {
          if (this.group) {
            this.imgSrc = '';
            this.group = Object.assign({}, null);
          }
        }
      }
    );
    this.sub$.add(routeSub$);
  }
  onGroupList() {
   }

  patchGroup() {
    this.groupForm.patchValue({
      groupName: this.group.groupName,
      description: this.group.description,
    });
  }

  createGroupForm() {
    this.groupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
    });
  }





  onGroupSubmit() {
    if (this.groupForm.valid) {
      const grObj = this.createBuildForm();
      if (this.group) {
        this.sub$.sink = this.groupService
          .updateGroup(this.group.id, grObj)
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('GROUP_UPDATE_SUCCESSFULLY'));
            this.router.navigate(['/group']);
          });
      } else {
        this.sub$.sink = this.groupService
          .saveGroup(grObj)
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('GROUP_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/group']);
          });
      }
    } else {
      this.markFormGroupTouched(this.groupForm);
    }
  }

  private markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createBuildForm(): Group {
    const groupObj: Group = {
      id: this.group ? this.group.id : null,
      groupName: this.groupForm.get('groupName').value,
      description: this.groupForm.get('description').value
    };
    return groupObj;
  }

}
