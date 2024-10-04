import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Role } from '@core/domain-classes/role';
import { CommonService } from '@core/services/common.service';
import { User } from '@core/domain-classes/user';
import { UserRoles } from '@core/domain-classes/user-roles';
import { RoleService } from '../role.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.scss']
})
export class RoleUsersComponent extends BaseComponent implements OnInit {
  roles: Role[];
  allUsers: User[];
  selectedRole: Role = null;
  roleUsers: UserRoles[] = [];
  otherUsers: UserRoles[] = [];
  selectedRoleId: string;
  constructor(
    private commonService: CommonService,
    private roleService: RoleService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.getRoles();
    this.getAllUsers();
  }

  addUser(event: CdkDragDrop<UserRoles[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const userRolesToSave: UserRoles[] = [].concat(this.roleUsers);
      userRolesToSave.push(event.previousContainer.data[event.previousIndex]);
      userRolesToSave.map(c => c.roleId = this.selectedRole.id);
      this.sub$.sink = this.roleService.updateRoleUsers(this.selectedRole.id, userRolesToSave).subscribe(() => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.toastrService.success(`${this.translationService.getValue('USER_ADDED_SUCCESSFULLY_TO_ROLE')} ${this.selectedRole.name}`);
      }, () => {
        this.roleUsers.splice(event.previousIndex, 1);
        this.toastrService.error(`${this.translationService.getValue('ERROR_WHILE_ADDING_USER_TO_ROLE')} ${this.selectedRole.name}`);
      });
    }
  }

  removeUser(event: CdkDragDrop<UserRoles[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const userRolesToSave = this.roleUsers.filter(d => event.previousContainer.data[event.previousIndex].userId != d.userId);
      this.sub$.sink = this.roleService.updateRoleUsers(this.selectedRole.id, userRolesToSave).subscribe(() => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.toastrService.success(`${this.translationService.getValue('USER_REMOVED_SUCCESSFULLY_FROM_ROLE')} ${this.selectedRole.name}`);
      }, () => {
        this.toastrService.error(`${this.translationService.getValue('ERROR_WHILE_REMOVING_USER_FROM_ROLE')} ${this.selectedRole.name}`);
      });
    }
  }

  onRoleChange() {
    this.selectedRole = this.roles.find(c => c.id === this.selectedRoleId);
    this.sub$.sink = this.roleService.getRoleUsers(this.selectedRole.id).subscribe((users: UserRoles[]) => {
      this.roleUsers = users;
      const selectedUserIds = this.roleUsers.map(m => m.userId);
      this.otherUsers = this.allUsers.filter(d => selectedUserIds.indexOf(d.id) < 0)
        .map(ds => {
          return {
            userId: ds.id,
            roleId: this.selectedRole.id,
            userName: ds.userName,
            firstName: ds.firstName,
            lastName: ds.lastName
          }
        });
    });
  }

  getRoles() {
    this.sub$.sink = this.commonService.getRoles()
      .subscribe((roles: Role[]) => {
        this.roles = roles;
        if (this.roles.length > 0) {
          this.selectedRole = this.roles[0];
          this.selectedRoleId = this.roles[0].id;
          this.onRoleChange();
        }
      });
  }

  getAllUsers() {
    this.sub$.sink = this.commonService.getAllUsers().subscribe((users: User[]) => {
      this.allUsers = users;
      this.otherUsers = users.map(ds => {
        return {
          userId: ds.id,
          roleId: '',
          userName: ds.userName,
          firstName: ds.firstName,
          lastName: ds.lastName
        }
      });;
    });
  }
}
