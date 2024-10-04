import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { UserAuth } from '../domain-classes/user-auth';
import { CommonHttpErrorService } from '../error-handler/common-http-error.service';
import { CommonError } from '../error-handler/common-error';
import { User } from '@core/domain-classes/user';
import { Router } from '@angular/router';
import { ClonerService } from '@core/services/clone.service';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { environment } from '@environments/environment';


@Injectable(
  { providedIn: 'root' }
)
export class SecurityService {
  // securityObject: UserAuth = new UserAuth();
  private _securityObject$: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);
  private _companyProfile$: BehaviorSubject<CompanyProfile> = new BehaviorSubject<CompanyProfile>(null);
  public currencyCode = 'USD';

  public get companyProfile(): Observable<CompanyProfile> {
    return this._companyProfile$;
  }

  public get securityObject$(): Observable<UserAuth> {
    return this._securityObject$.pipe(
      map(c => {
        if (c) {
          return c;
        }
        const currenyData = localStorage.getItem('authObj');
        if (currenyData) {
          this._securityObject$.next(JSON.parse(currenyData))
          return JSON.parse(currenyData);
        }
        return null;
      })
    );
  }
  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    private router: Router,
    private clonerService: ClonerService
  ) {

  }

  login(entity: User): Observable<UserAuth | CommonError> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http.post<UserAuth>('authentication', entity)
      .pipe(
        tap((resp) => {
          localStorage.setItem('authObj', JSON.stringify(resp));
          localStorage.setItem('bearerToken', resp.bearerToken);
          this._securityObject$.next(resp);
        })
      ).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  isLogin(): boolean {
    const authStr = localStorage.getItem('authObj');
    if (authStr)
      return true;
    else
      return false;
  }

  logout(): void {
    this.resetSecurityObject();
  }

  resetSecurityObject(): void {
    localStorage.removeItem('authObj');
    localStorage.removeItem('bearerToken');
    this._securityObject$.next(null);
    this.router.navigate(['/login']);
  }

  updateProfile(companyProfile: CompanyProfile) {
    this.currencyCode = companyProfile.currencyCode;
    if (companyProfile.logoUrl) {
      companyProfile.logoUrl = `${environment.apiUrl}${companyProfile.logoUrl}`
    }
    this._companyProfile$.next(companyProfile)
  }

  updateUserProfile(user: User) {
    const authObj: UserAuth = JSON.parse(localStorage.getItem('authObj'))
    authObj.firstName = user.firstName;
    authObj.lastName = user.lastName;
    authObj.profilePhoto = user.profilePhoto;
    authObj.phoneNumber = user.phoneNumber;
    localStorage.setItem('authObj', JSON.stringify(authObj));
    this._securityObject$.next(this.clonerService.deepClone<UserAuth>(authObj));
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  // tslint:disable-next-line: typedef
  hasClaim(claimType: any, claimValue?: any): boolean {
    let ret = false;
    // See if an array of values was passed in.
    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType, claimValue);
    } else {
      const claims: string[] = claimType;
      if (claims) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }
    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret = false;
    let auth: UserAuth = null;
    // Retrieve security object
    const authStr = localStorage.getItem('authObj');
    if (authStr) {
      auth = JSON.parse(authStr);
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : 'true';
      }
      // Attempt to find the claim
      ret =
        auth.claims.find(
          (c) =>
            c.claimType && c.claimType.toLowerCase() == claimType && c.claimValue == claimValue
        ) != null;
    }
    return ret;
  }


  getUserDetail(): UserAuth {
    var userJson = localStorage.getItem('authObj');
    return JSON.parse(userJson);
  }
}
