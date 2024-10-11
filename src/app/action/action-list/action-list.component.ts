import { Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Action } from '@core/domain-classes/action';
import { CommonError } from '@core/error-handler/common-error';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class ActionListComponent extends BaseComponent implements OnInit {

  actions: Action[] = [];
  displayedColumns: string[] = ['action', 'name'];
  isLoadingResults = true;

  constructor(
    private actionService: ActionService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private commonService: CommonService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getActions();
  }

  deleteRole(action: Action) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${action.name}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.actionService.deleteAction(action.id).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('ACTION_DELETED_SUCCESSFULLY'));
            this.getActions();
          });
        }
      });
  }

  getActions(): void {
    this.isLoadingResults = true;
    this.sub$.sink = this.commonService.getRoles()
      .subscribe((data: Action[]) => {
        this.isLoadingResults = false;
        this.actions = data;
      }, (err: CommonError) => {
        err.messages.forEach(msg => {
          this.toastrService.error(msg)
        });
      });
  }

}
