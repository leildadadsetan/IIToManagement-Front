import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { CommonError } from '@core/error-handler/common-error';
import { User } from '@core/domain-classes/user';
import { OnlineUser } from '@core/domain-classes/online-user';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginFormGroup: UntypedFormGroup;
  isLoading = false;
  userData: User;
  resultMessage: string;
  fieldTextType: boolean = false;
  lat: number;
  lng: number;
  logoImage: string;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private signalrService: SignalrService,
    public translationService:TranslationService

  ) {
    super(translationService);

  }

  ngOnInit(): void {
    this.companyProfileSubscription();
    this.createFormGroup();
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe(profile => {
      if (profile) {
        this.logoImage = profile.logoUrl;
      }
    });
  }

  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      this.isLoading = true;
      const userObject = Object.assign(this.loginFormGroup.value, { latitude: this.lat, longitude: this.lng });
      this.sub$.sink = this.securityService.login(userObject)
        .subscribe(
          (c: UserAuth) => {
            const userInfo: OnlineUser = {
              email: c.email,
              id: c.id,
              connectionId: null
            }
            this.signalrService.addUser(userInfo);
            this.isLoading = false;
            this.router.navigate(['/']);
          },
          (err: CommonError) => {
            this.isLoading = false;
            if (err.messages) {
              err.messages.forEach(msg => {
                this.toastr.error(msg);
              });
            } else if (err.error) {
              this.toastr.error(err.error as string);
            }
          }
        );
    }
  }

  createFormGroup(): void {
    this.loginFormGroup = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  onRegistrationClick(): void {
    this.router.navigate(['/registration']);
  }
}
