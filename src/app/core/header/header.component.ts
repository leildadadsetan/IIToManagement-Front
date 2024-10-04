import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { LanguageFlag, Languages } from './languages';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('selectElem', { static: true }) el: ElementRef;
  @Input() public lead: any;
  public isFromPos = false;
  navbarOpen = false;
  appUserAuth: UserAuth = null;
  language: LanguageFlag;
  notificationCount: number = 0;
  notificationUserList: ReminderScheduler[] = [];
  languages: LanguageFlag[] = [];
  profilePath = '';
  logoImage = '';
  oldLang: string = ''
  constructor(
    private router: Router,
    private securityService: SecurityService,
    private signalrService: SignalrService,
    public translationService: TranslationService,
    private commonService: CommonService,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.hideOrShowBaseOnCurrentUrl();
    this.languages = Languages.languages;
    this.routerNavigate();
    this.setTopLogAndName();
    this.setDefaultLanguage();
    this.getUserNotification();
    this.getNotificationList();
    this.companyProfileSubscription();
  }

  routerNavigate() {
    this.sub$.sink = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        if (event.url.indexOf('pos') > -1) {
          this.isFromPos = true;
          this.lead.className = 'pos-page';
        } else {
          this.isFromPos = false;
          this.lead.className = '';
        }
      })
  }
  
  hideOrShowBaseOnCurrentUrl() {
    if (this.router.url.indexOf('pos') > -1) {
      this.isFromPos = true;
      this.lead.className = 'pos-page';
    } else {
      this.isFromPos = false;
      this.lead.className = '';
    }
  }

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe(profile => {
      if (profile) {
        this.logoImage = profile.logoUrl;
      }
    });
  }

  getUserNotification() {
    this.sub$.sink = this.signalrService.userNotification$
      .subscribe(c => {
        this.getUserNotificationCount();
        this.getNotificationList();
      });
  }

  getUserNotificationCount() {
    this.sub$.sink = this.commonService.getUserNotificationCount()
      .subscribe(c => {
        this.notificationCount = c;
      });
  }

  getNotificationList() {
    this.sub$.sink = this.commonService.getTop10UserNotification()
      .subscribe(c => {
        this.notificationUserList = c;
      });
  }

  setDefaultLanguage() {
    const lang = this.translationService.getSelectedLanguage();
    if (lang) this.setLanguageWithRefresh(lang);
  }

  setLanguageWithRefresh(lang: string) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
    if (this.oldLang == 'ar' || lang == 'ar') {
      //this.setLanguage(lang);
    }

  }

  setLanguageWithRefreshNew(lang: string) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
  }

  setNewLanguageRefresh(lang: string) {
    this.translationService.setLanguage(lang);
    this.oldLang = this.translationService.getSelectedLanguage();
    this.sub$.sink = this.translationService
      .setLanguage(lang)
      .subscribe((response) => {
        this.setLanguageWithRefreshNew(response['LANGUAGE']);
      });
  }

  setLanguage(currentLang) {
    if (currentLang == 'ar') {
      this.setDynamicStyleMain(`main-style`, currentLang)
      this.setDynamicStyleMain(`common-style`, currentLang);
      this.setDynamicStyleBootstrap(`boostrap-style`, currentLang);
    } else {
      this.setDynamicStyleMain('main-style', '')
      this.setDynamicStyleMain('common-style', '');
      this.setDynamicStyleBootstrap(`boostrap-style`, '');
    }
  }

  setDynamicStyleBootstrap(styleName: string, lang: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let themeLink = this.document.getElementById(
      `${styleName}`
    ) as HTMLLinkElement;
    if (themeLink) {
      if (lang) {
        themeLink.href = "bootstrap-rtl-style.css";
      } else {
        themeLink.href = "bootstrap-style.css";
      }
    } else {
      const style = this.document.createElement('link');
      style.id = `${styleName}`;
      style.rel = 'stylesheet';
      style.href = lang ? `bootstrap-rtl-style.css` : `bootstrap-style.css`;
      head.appendChild(style);
    }
  }

  setDynamicStyleMain(styleName: string, lang: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let themeLink = this.document.getElementById(
      `${styleName}`
    ) as HTMLLinkElement;
    if (themeLink) {
      if (lang) {
        themeLink.href = styleName + "-ar.css";
      } else {
        themeLink.href = styleName + ".css";
      }

    } else {
      const style = this.document.createElement('link');
      style.id = `${styleName}`;
      style.rel = 'stylesheet';
      style.href = lang ? `${styleName}-ar.css` : `${styleName}.css`;
      head.appendChild(style);
    }

  }


  removedDynamicStyleMain(styleName) {
    const style = this.document.getElementById(styleName);
    if (style) {
      this.document.removeChild(style)
    }
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe((c) => {
      if (c) {
        this.appUserAuth = c;
        if (this.appUserAuth.profilePhoto) {
          this.profilePath = environment.apiUrl + this.appUserAuth.profilePhoto;
        }
      }
    });
  }

  onLogout(): void {
    this.signalrService.logout(this.appUserAuth.id);
    this.securityService.logout();
    this.router.navigate(['/login']);
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile']);
  }

  public togglediv() {
    if (this.lead.className === 'toggled') {
      this.lead.className = '';
    } else {
      this.lead.className = 'toggled';
    }
  }
}
