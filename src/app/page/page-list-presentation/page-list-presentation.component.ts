import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { BaseComponent } from 'src/app/base.component';
import { Page } from '@core/domain-classes/page';
import { ManagePageComponent } from '../manage-page/manage-page.component';
import { TranslationService } from '@core/services/translation.service';
import { ActionService } from '@core/services/action.service';
import { ManageActionComponent } from 'src/app/page/manage-action/manage-action.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Action } from '@core/domain-classes/action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-page-list-presentation',
  templateUrl: './page-list-presentation.component.html',
  styleUrls: ['./page-list-presentation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PageListPresentationComponent extends BaseComponent implements OnInit {
  @Input() pages: Page[];
  @Input() loading: boolean;
  @Output() deletePageHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['subaction', 'action', 'name','order'];
  subActionColumnToDisplay: string[] = ['action', 'name','order','code'];
  subActions: Page[] = [];
  expandedElement: Page | null;

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private actionService: ActionService,
    private cd: ChangeDetectorRef,
    private toastrServoce: ToastrService,
    public translationService: TranslationService,

  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {

  }

  toggleRow(element: Page) {
    this.subActions = [];
    if (element) {
      this.actionService.getActionByPage(element.id).subscribe(subCat => {
        this.subActions = subCat;
      });
    }
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  deletePage(page: Page): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${page.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deletePageHandler.emit(page.id);
        }
      });
  }

  manageAction(action: Action): void {
    const dialogRef = this.dialog.open(ManageActionComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, action, { pageId: this.expandedElement.id },{pagename:this.expandedElement.name})
    });

    this.sub$.sink = dialogRef.afterClosed()
      .subscribe((result: Action) => {
        if (result) {
          this.actionService.getActionByPage(this.expandedElement.id).subscribe(subCat => {
            this.subActions = subCat;
          });
        }
      });
  }

  deleteAction(action: Action): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${action.name}?`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.sub$.sink = this.actionService.delete(action.id).subscribe(() => {
            this.toastrServoce.success(this.translationService.getValue('ACTION_DELETED_SUCCESSFULLY'));
            this.actionService.getActionByPage(this.expandedElement.id).subscribe(subCat => {
              this.subActions = subCat;
            });
          })
        }
      });
  }

  managePage(page: Page): void {
    this.dialog.open(ManagePageComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, page)
    });
  }

  addAction(action: Action) {
    this.manageAction({
      id: '',
      name: '',
      code: ''
    });
  }
}
