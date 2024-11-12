import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '@core/domain-classes/group';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { GroupService } from '@core/services/group.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/user/user.service';
import { UserGroupService } from '../user-group.service';

@Component({
  selector: 'app-manage-user-group',
  templateUrl: './manage-user-group.component.html',
  styleUrls: ['./manage-user-group.component.scss']
})
export class ManageUserGroupComponent extends BaseComponent implements OnInit {
  groupForm: UntypedFormGroup;
  users: User[] = [];
  groups: Group[] = [];
  isLoading = false;
  isReceiptDeleted = false;

 
  constructor(private router: Router,
    private fb: UntypedFormBuilder,
    private groupervice: GroupService,
    private userService: UserService,
    private groupService: GroupService,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private activatedRoute: ActivatedRoute) { 
      super(translationService);
    this.getLangDir();
    }

  ngOnInit(): void {
    this.createGroupForm();
    this.getGroups();
    this.getUsers();
    this.activatedRoute.data.subscribe((data: { group: Group }) => {
      this.groupForm.patchValue(data.group);
    })
  }

  createGroupForm() {
    this.groupForm = this.fb.group({
      id: [''],
      reference: [''],
      expenseCategoryId: ['', [Validators.required]],
       expenseById: [''],
      description: [''],
      });
  }

  getGroups() {
    this.groupService.getAll().subscribe(categories => {
      this.groups = categories;
    })
  }

  getUsers() {
    let userResource = new UserResource();
    userResource.pageSize = 10;
    userResource.orderBy = 'name desc'
    this.userService.getUsers(userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }

 
 

 
 
}
