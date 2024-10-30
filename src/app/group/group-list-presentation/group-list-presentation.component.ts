import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Group } from '@core/domain-classes/group';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';
import { ManageGroupComponent } from '../manage-group/manage-group.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-group-list-presentation',
  templateUrl: './group-list-presentation.component.html',
  styleUrls: ['./group-list-presentation.component.scss']
})
export class GroupListPresentationComponent extends BaseComponent {
  @Input() set groups(value: Group[]) {
    this.dataSource = new MatTableDataSource<Group>(value);
    this.dataSource.paginator = this.paginator;
  };

  @Input() loading: boolean = false;
  @Output() deleteGroupHandler: EventEmitter<string> = new EventEmitter<string>();
  dataSource = new MatTableDataSource<Group>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['action',  'name'];
  footerToDisplayed = ['footer'];
  baseUrl = environment.apiUrl;

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
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
      width: '110vh',
      direction:this.langDir,
      data: Object.assign({}, group)
    });
  }

}
