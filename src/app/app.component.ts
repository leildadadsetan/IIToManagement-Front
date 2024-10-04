import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { OnlineUser } from '@core/domain-classes/online-user';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(
    private signalrService: SignalrService,
    private securityService: SecurityService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super(translationService);
    this.getLangDir();
    this.setProfile();
    this.companyProfileSubscription();
  }

  ngOnInit() {
    this.routerNavigate();
    this.signalrService.startConnection().then((resolve) => {
      if (resolve) {
        this.signalrService.handleMessage();
        this.getAuthObj();
      }
    });
  }

  setProfile() {
    this.route.data.subscribe((data: { profile: CompanyProfile }) => {
      if (data.profile) {
        this.securityService.updateProfile(data.profile);
      }
    });
  }

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe((profile) => {
      if (profile) {
        this.titleService.setTitle(profile.title);
      }
    });
  }

  getAuthObj() {
    this.sub$.sink = this.securityService.securityObject$.subscribe(
      (c: UserAuth) => {
        if (c) {
          const online: OnlineUser = {
            email: c.email,
            id: c.id,
            connectionId: this.signalrService.connectionId,
          };
          this.signalrService.addUser(online);
        }
      }
    );
  }

  routerNavigate() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (
          event.url.indexOf('purchase-order-report') > -1 ||
          event.url.indexOf('sales-order-report') > -1 ||
          event.url.indexOf('product-purchase-report') > -1 ||
          event.url.indexOf('product-sales-report') > -1 ||
          event.url.indexOf('product-warehouse-report') > -1||
          event.url.indexOf('stock-report') > -1 ||
          event.url.indexOf('purchase-payment-report') > -1 ||
          event.url.indexOf('expense-report') > -1 ||
          event.url.indexOf('profit-loss-report') > -1 ||
          event.url.indexOf('sales-payment-report') > -1 ||
          event.url.indexOf('supplier-payment-report') > -1 ||
          event.url.indexOf('sales-purchase-report') > -1 ||
          event.url.indexOf('customer-payment-report') > -1 ||
          event.url.indexOf('warehouse-report') > -1
        ) {
          this.commonService.setCurrentUrl('report');
        } else if (
          event.url.indexOf('products') > -1 ||
          event.url.indexOf('product-category') > -1 ||
          event.url.indexOf('tax') > -1 ||
          event.url.indexOf('unitConversation') > -1 ||
          event.url.indexOf('brand') > -1 ||
          event.url.indexOf('warehouse') > -1
        ) {
          this.commonService.setCurrentUrl('product');
        } else if (event.url.indexOf('supplier') > -1) {
          this.commonService.setCurrentUrl('supplier');
        } else if (event.url.indexOf('customer') > -1) {
          this.commonService.setCurrentUrl('customer');
        } else if (
          event.url.indexOf('inquiry') > -1 ||
          event.url.indexOf('inquiry-status') > -1 ||
          event.url.indexOf('inquiry-source') > -1
        ) {
          this.commonService.setCurrentUrl('inquiry');
        } else if (event.url.indexOf('purchase-order-request') > -1) {
          this.commonService.setCurrentUrl('purchase-order-request');
        } else if (event.url.indexOf('purchase-order-return') > -1) {
          this.commonService.setCurrentUrl('purchase-order-return');
        } else if (event.url.indexOf('purchase-order') > -1) {
          this.commonService.setCurrentUrl('purchase-order');
        } else if (event.url.indexOf('sales-order-return') > -1) {
          this.commonService.setCurrentUrl('sales-order-return');
        } else if (event.url.indexOf('sales-order') > -1) {
          this.commonService.setCurrentUrl('sales-order');
        } else if (
          event.url.indexOf('expense') > -1 ||
          event.url.indexOf('expense-category') > -1
        ) {
          this.commonService.setCurrentUrl('expense');
        } else if (event.url.indexOf('reminders') > -1) {
          this.commonService.setCurrentUrl('reminders');
        } else if (
          event.url.indexOf('users') > -1 ||
          event.url.indexOf('sessions') > -1
        ) {
          this.commonService.setCurrentUrl('users');
        } else if (event.url.indexOf('roles') > -1) {
          this.commonService.setCurrentUrl('roles');
        } else if (
          event.url.indexOf('email-smtp') > -1 ||
          event.url.indexOf('emailtemplate') > -1 ||
          event.url.indexOf('send-email') > -1
        ) {
          this.commonService.setCurrentUrl('email');
        } else if (
          event.url.indexOf('company-profile') > -1 ||
          event.url.indexOf('country') > -1 ||
          event.url.indexOf('cities') > -1
        ) {
          this.commonService.setCurrentUrl('settings');
        } else if (
          event.url.indexOf('login-audit') > -1 ||
          event.url.indexOf('logs') > -1
        ) {
          this.commonService.setCurrentUrl('logs');
        } else {
          this.commonService.setCurrentUrl('');
        }
      });
  }
}
