import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Group } from '@core/domain-classes/group';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageGroupComponent } from '../manage-group/manage-group.component';

@Component({
  selector: 'app-group-list-presentation',
  templateUrl: './group-list-presentation.component.html',
  styleUrls: ['./group-list-presentation.component.scss']
})
export class GroupListPresentationComponent extends BaseComponent implements OnInit {

  @Input() groups: Group[];
  @Input() loading: boolean = false;
  @Output() deleteGroupHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  deleteGroup(group: Group): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${group.groupName}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteGroupHandler.emit(group.id);
        }
      });
  }

  manageGroup(group: Group): void {
    this.dialog.open(ManageGroupComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, group)
    });
  }
}
