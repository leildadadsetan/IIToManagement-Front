import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { User } from '@core/domain-classes/user';
import { Page } from '@core/domain-classes/page';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-user-permission-presentation',
  templateUrl: './user-permission-presentation.component.html',
  styleUrls: ['./user-permission-presentation.component.scss']
})
export class UserPermissionPresentationComponent extends BaseComponent implements OnInit {
  @Input() pages: Page[];
  @Input() user: User;
  @Output() manageUserClaimAction: EventEmitter<User> = new EventEmitter<User>();
  step: number = 0;
  constructor(public translationService:TranslationService) { 
    super(translationService);
    this.getLangDir(); }

  ngOnInit(): void {
  }

  checkPermission(actionId: string): boolean {
    const pageAction = this.user.userClaims.find(c => c.actionId === actionId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  onPermissionChange(flag: MatSlideToggleChange, page: Page, action: Action) {
    if (flag.checked) {
      this.user.userClaims.push({
        userId: this.user.id,
        claimType: action.code,
        claimValue: '',
        actionId: action.id
      })
    } else {
      const roleClaimToRemove = this.user.userClaims.find(c => c.actionId === action.id);
      const index = this.user.userClaims.indexOf(roleClaimToRemove, 0);
      if (index > -1) {
        this.user.userClaims.splice(index, 1);
      }
    }
  }

  onPageSelect(event: MatCheckboxChange, page: Page) {
    if (event.checked) {
      page.pageActions.forEach(action => {
        if (!this.checkPermission(action.id)) {
          this.user.userClaims.push({
            userId: this.user.id,
            claimType: action.code,
            claimValue: '',
            actionId: action.id,
          });
        }
      });
    } else {
      var actions = page.pageActions?.map(c => c.id);
      this.user.userClaims = this.user.userClaims.filter(c => actions.indexOf(c.actionId) < 0);
    }
  }

  saveUserClaim() {
    this.manageUserClaimAction.emit(this.user);
  }

  selecetAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.pages.forEach(page => {
        page.pageActions.forEach(action => {
          if (!this.checkPermission(action.id)) {
            this.user.userClaims.push({
              userId: this.user.id,
              claimType: action.code,
              claimValue: '',
              actionId: action.id
            });
          }
        });
      });
    } else {
      this.user.userClaims = [];
    }
  }
}
