import { Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Role } from '@core/domain-classes/role';
import { CommonError } from '@core/error-handler/common-error';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends BaseComponent implements OnInit {

  roles: Role[] = [];
  displayedColumns: string[] = ['action', 'name'];
  isLoadingResults = true;

  constructor(
    private roleService: RoleService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private commonService: CommonService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getRoles();
  }

  deleteRole(role: Role) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${role.name}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.roleService.deleteRole(role.id).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('ROLE_DELETED_SUCCESSFULLY'));
            this.getRoles();
          });
        }
      });
  }

  getRoles(): void {
    this.isLoadingResults = true;
    this.sub$.sink = this.commonService.getRoles()
      .subscribe((data: Role[]) => {
        this.isLoadingResults = false;
        this.roles = data;
      }, (err: CommonError) => {
        err.messages.forEach(msg => {
          this.toastrService.error(msg)
        });
      });
  }

}
