import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InquiryTask } from '@core/domain-classes/inquiry-task';
import { InquiryTaskEdit } from '@core/domain-classes/inquiry-task-edit';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { InquiryTaskService } from '../inquiry-task/inquiry-task.service';

@Component({
  selector: 'app-inquiry-task-add',
  templateUrl: './inquiry-task-add.component.html',
  styleUrls: ['./inquiry-task-add.component.scss']
})
export class InquiryTaskAddComponent extends BaseComponent implements OnInit {

  inquiryTaskForm: UntypedFormGroup;
  users: User[] = [];
  userResource: UserResource;
  minDate = new Date();
  public priorities: Array<any> = [
    {
      name: 'High',
      value: 'High',
    },
    {
      name: 'Low',
      value: 'Low',
    },
    {
      name: 'Normal',
      value: 'Normal'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InquiryTaskEdit,
    public dialogRef: MatDialogRef<InquiryTaskAddComponent>,
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private inquiryTaskService: InquiryTaskService,
    private toastrService: ToastrService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
    this.userResource = new UserResource();
    this.userResource.pageSize = 10;
    this.userResource.orderBy = 'firstName desc'
  }

  ngOnInit(): void {
    this.createInquiryTask();
    this.getUsers();
    this.patchInquiryTask();
  }

  createInquiryTask() {
    this.inquiryTaskForm = this.fb.group({
      subject: ['', [Validators.required]],
      description: [''],
      dueDate: [null],
      isOpen: [true],
      assignTo: [],
      priority: []
    });
  }
  patchInquiryTask() {
    if (this.data.inquiryTask) {
      this.inquiryTaskForm.patchValue({
        subject: this.data.inquiryTask.subject,
        description: this.data.inquiryTask.description,
        dueDate: this.data.inquiryTask.dueDate,
        isOpen: this.data.inquiryTask.isOpen,
        assignTo: this.data.inquiryTask.assignTo,
        priority: this.data.inquiryTask.priority
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  buildInquiryTask(): InquiryTask {
    const inquiryTask: InquiryTask = {
      subject: this.inquiryTaskForm.get('subject').value,
      description: this.inquiryTaskForm.get('description').value,
      dueDate: this.inquiryTaskForm.get('dueDate').value,
      inquiryId: this.data.inquiryId,
      isOpen: this.inquiryTaskForm.get('isOpen').value,
      assignTo: this.inquiryTaskForm.get('assignTo').value,
      priority: this.inquiryTaskForm.get('priority').value,
    }
    return inquiryTask;
  }

  getUsers() {
    this.sub$.sink = this.userService.getUsers(this.userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }
  onInquiryTaskSave() {
    if (this.inquiryTaskForm.invalid) {
      this.inquiryTaskForm.markAllAsTouched();
      return;
    }
    const inquiryTask = this.buildInquiryTask();
    if (this.data.inquiryTask) {
      this.sub$.sink = this.inquiryTaskService.updateInquiryActivity(this.data.inquiryTask.id, inquiryTask)
        .subscribe(c => {
          this.toastrService.success(this.translationService.getValue('INQUIRY_TASK_UPDATED'));
          this.dialogRef.close();
        });
    } else {
      this.sub$.sink = this.inquiryTaskService.saveInquiryActivity(inquiryTask)
        .subscribe(c => {
          this.toastrService.success(this.translationService.getValue('INQUIRY_TASK_SAVE_SUCCESSFULLY'));
          this.dialogRef.close();
        });
    }

  }

}
