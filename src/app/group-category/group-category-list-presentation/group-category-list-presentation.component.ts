import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { GroupCategory } from '@core/domain-classes/group-category';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageGroupCategoryComponent } from '../manage-group-category/manage-group-category.component';

@Component({
  selector: 'app-group-category-list-presentation',
  templateUrl: './group-category-list-presentation.component.html',
  styleUrls: ['./group-category-list-presentation.component.scss']
})
export class GroupCategoryListPresentationComponent extends BaseComponent implements OnInit {

  @Input() groupCategories: GroupCategory[];
  @Input() loading: boolean = false;
  @Output() deleteGroupCategoryHandler: EventEmitter<string> = new EventEmitter<string>();
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

  deleteGroupCategory(groupCategory: GroupCategory): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${GroupCategory.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteGroupCategoryHandler.emit(groupCategory.id);
        }
      });
  }

  manageGroupCategory(groupCategory: GroupCategory): void {
    this.dialog.open(ManageGroupCategoryComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, groupCategory)
    });
  }
}
