import { Component, OnInit } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { Page } from '@core/domain-classes/page';
import { ActionService } from '@core/services/action.service';
import { PageService } from '@core/services/page.service';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { RoleService } from '../role.service';
import { Role } from '@core/domain-classes/role';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent extends BaseComponent implements OnInit {
  pages: Page[];
  role: Role;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private pageService: PageService,
    private actionService: ActionService,
    private roleService: RoleService,
    public translationService: TranslationService) {
    super(translationService);
    
  }

  ngOnInit(): void {
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { role: Role }) => {
        if (data.role) {
          this.role = data.role;
        } else {
          this.role = {
            roleClaims: [],
            userRoles: []
          };
        }
      });
    const getActionRequest = this.actionService.getAll();
    const getPageRequest = this.pageService.getAll();
    forkJoin({ getActionRequest, getPageRequest }).subscribe(response => {
      this.pages = response.getPageRequest;
      this.pages = this.pages.map((p: any) => {
        const pageActions = response.getActionRequest.filter(c => c.pageId == p.id);
        const result = Object.assign({}, p, { pageActions: pageActions });
        return result;
      })
    })
  }

  manageRole(role: Role): void {
    if (!role.name) {
      this.toastrService.error(this.translationService.getValue('PLEASE_ENTER_ROLE_NAME'));
      return;
    }
    if (role.roleClaims.length == 0) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_AT_LEAT_ONE_PERMISSION'));
      return;
    }
    if (!role.id)
      this.sub$.sink = this.roleService.addRole(role).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ROLE_SAVED_SUCCESSFULLY'));
        this.router.navigate(['/roles']);
      });
    else
      this.sub$.sink = this.roleService.updateRole(role).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ROLE_UPDATED_SUCCESSFULLY'));
        this.router.navigate(['/roles']);
      });
  }
}
