import { Component, OnInit } from '@angular/core';
import { Group } from '@core/domain-classes/group';
import { GroupService } from '@core/services/group.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent extends BaseComponent implements OnInit {
  groups$: Observable<Group[]>;
  loading$: Observable<boolean>;
  constructor(
    private groupService: GroupService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
  }
  ngOnInit(): void {

    this.loading$ = this.groupService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getGroups();
          }
        })
      )
    this.groups$ = this.groupService.entities$
  }

  getGroups(): void {
    this.groupService.getAll();
  }

  deleteGroup(id: string): void {
    this.sub$.sink = this.groupService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('EXPENSE_CATEGORY_DELETED_SUCCESSFULLY'));
    });
  }
}
