import { Component, OnInit } from '@angular/core';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UnitConversationService } from '../unit-conversation.service';

@Component({
  selector: 'app-unit-conversation-list',
  templateUrl: './unit-conversation-list.component.html',
  styleUrls: ['./unit-conversation-list.component.scss']
})
export class UnitConversationListComponent extends BaseComponent implements OnInit {
  unitConversations$: UnitConversation[] = [];
  constructor(
    private unitConversationService: UnitConversationService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);

  }

  ngOnInit(): void {
    this.getUnitConversations();
  }

  getUnitConversations(): void {
    this.unitConversationService.getUnitConversations().subscribe(c => this.unitConversations$ = c);;
  }

  deleteUnitConversation(id: string): void {
    this.unitConversationService.deleteUnitConversation(id).subscribe(d => {
      this.toastrService.success(this.translationService.getValue('UNIT_CONVERSATION_DELETED_SUCCESSFULLY'));
      this.getUnitConversations();
    });
  }

  manageUnitConversation(category: UnitConversation): void {
    this.getUnitConversations();
  }
}
