import { Component, OnInit } from '@angular/core';
import { GroupCategory } from '@core/domain-classes/group-category';
import { GroupCategoryService } from '@core/services/group-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-group-category-list',
  templateUrl: './group-category-list.component.html',
  styleUrls: ['./group-category-list.component.scss']
})
export class GroupCategoryListComponent extends BaseComponent implements OnInit {
  groupCategories$: Observable<GroupCategory[]>;
  loading$: Observable<boolean>;
  constructor(
    private groupCategoryService: GroupCategoryService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
  }
  ngOnInit(): void {

    this.loading$ = this.groupCategoryService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getGroupCategories();
          }
        })
      )
    this.groupCategories$ = this.groupCategoryService.entities$
  }

  getGroupCategories(): void {
    this.groupCategoryService.getAll();
  }

  deleteGroupCategory(id: string): void {
    this.sub$.sink = this.groupCategoryService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('GROUP_DELETED_SUCCESSFULLY'));
    });
  }
}
