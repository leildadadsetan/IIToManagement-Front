import {  Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageUnitConversationComponent } from '../manage-unit-conversation/manage-unit-conversation.component';

@Component({
  selector: 'app-unit-conversation-list-presentation',
  templateUrl: './unit-conversation-list-presentation.component.html',
  styleUrls: ['./unit-conversation-list-presentation.component.scss']
})
export class UnitConversationListPresentationComponent extends BaseComponent implements OnInit {
  @Input() unitConversations: UnitConversation[];
  @Output() addEditUnitConversationHandler: EventEmitter<UnitConversation> = new EventEmitter<UnitConversation>();
  @Output() deleteUnitConversationHandler: EventEmitter<string> = new EventEmitter<string>();
  columnsToDisplay: string[] = ['action',  'name','baseUnitName', 'operator', 'value'];
  expandedElement: UnitConversation | null;
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

  deleteUnitConversation(category: UnitConversation): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${category.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteUnitConversationHandler.emit(category.id);
        }
      });
  }

  manageUnitConversation(unitdata: UnitConversation): void {
    const dialogRef = this.dialog.open(ManageUnitConversationComponent, {
      width: '80vh',
      direction: this.langDir,
      data: {
        unitdata: Object.assign({}, unitdata),
        units: this.unitConversations
      }
    });

    this.sub$.sink = dialogRef.afterClosed()
      .subscribe((result: UnitConversation) => {
        if (result) {
          this.addEditUnitConversationHandler.emit(result);
        }
      });
  }
}
