import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationEnums } from '@core/domain-classes/application.enum';
import { CustomReminderScheduler } from '@core/domain-classes/custom-reminder-scheduler';
import { ModuleReference } from '@core/domain-classes/module-reference';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { User } from '@core/domain-classes/user';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-add-reminder-scheduler',
  templateUrl: './add-reminder-scheduler.component.html',
  styleUrls: ['./add-reminder-scheduler.component.scss']
})
export class AddReminderSchedulerComponent extends BaseComponent implements OnInit {

  reminderForm: UntypedFormGroup;
  users: User[] = [];
  selectedUsers: User[] = [];
  reminderSchedulers: ReminderScheduler[] = [];
  displayedColumns: string[] = ['subject', 'createdDate', 'userName'];

  constructor(
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    public translationService:TranslationService,
    public dialogRef: MatDialogRef<AddReminderSchedulerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleReference) {
      super(translationService);
      this.getLangDir();
     }

  ngOnInit(): void {
    this.createReminder();
    this.getUsers();
    this.getReminderSchedulers();
  }

  createReminder() {
    this.reminderForm = this.fb.group({
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      isEmailNotification: [true],
      reminderDate: [new Date()],
      selectedUsers: [null]
    });
  }
  buildReminderSchedule() {
    const selectedUsers = this.reminderForm.get('selectedUsers').value;
    const customReminderScheduler: CustomReminderScheduler = {
      subject: this.reminderForm.get('subject').value,
      message: this.reminderForm.get('message').value,
      isEmailNotification: this.reminderForm.get('isEmailNotification').value,
      createdDate: this.reminderForm.get('reminderDate').value,
      userIds: selectedUsers ? selectedUsers.map(c => c.id) : null,
      application: this.data.application,
      referenceId: this.data.referenceId
    };
    return customReminderScheduler;
  }

  getUsers() {
    this.commonService.getAllUsers().subscribe((u: User[]) => {
      this.users = u;
    });
  }

  saveReminder() {
    if (this.reminderForm.valid) {
      let reminderSchedulers = this.buildReminderSchedule();
      if (!reminderSchedulers.userIds) {
        reminderSchedulers.userIds = [];
      }
      this.commonService.addReminderSchedule(reminderSchedulers)
        .subscribe(c => {
          if (c) {
            this.dialogRef.close();
          }
        })
    } else {
      this.reminderForm.markAllAsTouched();
    }
  }
  getReminderSchedulers() {
    this.commonService.getReminderSchedulers(this.data)
      .subscribe((c: ReminderScheduler[]) => {
        this.reminderSchedulers = c;
      });
  }
  cancelReminder() {
    this.dialogRef.close();
  }

}
