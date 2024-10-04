import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { InquiryTask } from '@core/domain-classes/inquiry-task';
import { InquiryTaskEdit } from '@core/domain-classes/inquiry-task-edit';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { InquiryTaskAddComponent } from '../inquiry-task-add/inquiry-task-add.component';
import { InquiryTaskService } from './inquiry-task.service';

@Component({
  selector: 'app-inquiry-task',
  templateUrl: './inquiry-task.component.html',
  styleUrls: ['./inquiry-task.component.scss']
})
export class InquiryTaskComponent extends BaseComponent implements OnInit {

  @Input() inquiryId: string;
  inquiryTasks: InquiryTask[] = [];
  displayedColumns = ['action', 'subject', 'description', 'dueDate', 'isOpen', 'assignToName', 'priority'];
  constructor(
    private inquiryTaskService: InquiryTaskService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService,
    private dialog: MatDialog) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getInquiryTasks();
  }
  getInquiryTasks() {
    this.sub$.sink = this.inquiryTaskService.getInquiryTasks(this.inquiryId)
      .subscribe((c: InquiryTask[]) => {
        this.inquiryTasks = c;
      });
  }

  onDelete(id: string) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.inquiryTaskService.deleteInquiryActivity(id)
            .subscribe(() => {
              this.getInquiryTasks();
            });
        }
      });
  }
  onAddInquiryTask() {
    const inquiryTaskEdit: InquiryTaskEdit = {
      inquiryId: this.inquiryId,
      inquiryTask: null
    };
    const dialogRef = this.dialog.open(InquiryTaskAddComponent, {
      width: '600px',
      direction:this.langDir,
      data: inquiryTaskEdit
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe(result => {
        this.getInquiryTasks();
      });
  }
  onEditInquiryTask(inquiryTask: InquiryTask) {
    const inquiryTaskEdit: InquiryTaskEdit = {
      inquiryId: this.inquiryId,
      inquiryTask: inquiryTask
    };
    const dialogRef = this.dialog.open(InquiryTaskAddComponent, {
      width: '600px',
      direction:this.langDir,
      data: inquiryTaskEdit
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe(result => {
        this.getInquiryTasks();
      });
  }
  onChangeStatus(inquiryTask: InquiryTask) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_WANT_TO_CHANGE_STATUS'))
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          inquiryTask.isOpen = !inquiryTask.isOpen;
          this.sub$.sink = this.inquiryTaskService.updateInquiryActivity(inquiryTask.id, inquiryTask)
            .subscribe(() => {
              this.getInquiryTasks();
            });
        }
      });
  }
}
