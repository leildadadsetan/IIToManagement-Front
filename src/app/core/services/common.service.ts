import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@core/domain-classes/user';
import { catchError } from 'rxjs/operators';
import { Role } from '@core/domain-classes/role';
import { Country } from '@core/domain-classes/country';
import { City } from '@core/domain-classes/city';
import { ReminderFrequency, reminderFrequencies } from '@core/domain-classes/reminder-frequency';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { SendEmail } from '@core/domain-classes/send-email';
import { CustomReminderScheduler } from '@core/domain-classes/custom-reminder-scheduler';
import { ModuleReference } from '@core/domain-classes/module-reference';
import { Product } from '@core/domain-classes/product';
import { CountryService } from './country.service';
import { Currency } from '@core/domain-classes/currency';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    private countryService: CountryService) { }

    private _currentUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    public get currentUrl$() : Observable<string> {
      return this._currentUrl$.asObservable();
    }

    setCurrentUrl(url){
      this._currentUrl$.next(url);
    }


  getAllUsers(): Observable<User[] | CommonError> {
    const url = `user/getAllUsers`;
    return this.httpClient.get<User[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRoles(): Observable<Role[] | CommonError> {
    const url = `role`;
    return this.httpClient.get<Role[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCountry() {
    return this.countryService.getAll();
  }

  getCityByName(countryName: string, cityName: string) {
    const url = `City/country?countryName=${countryName}&&cityName=${cityName}`;
    return this.httpClient.get<City[]>(url);
  }

  getUsers(): Observable<User[] | CommonError> {
    const url = `user/GetUsers`;
    return this.httpClient.get<User[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getReminderFrequency(): Observable<ReminderFrequency[]> {
    return of(reminderFrequencies);
  }

  getUserNotificationCount(): Observable<number> {
    return this.httpClient.get<number>('user/notification/count');
  }
  getTop10UserNotification(): Observable<ReminderScheduler[]> {
    return this.httpClient.get<ReminderScheduler[]>('reminder/notofication/top10');
  }
  sendEmail(sendEmail: SendEmail): Observable<boolean> {
    return this.httpClient.post<boolean>('sendEmail/suppliers', sendEmail);
  }
  addReminderSchedule(customReminderScheduler: CustomReminderScheduler) {
    return this.httpClient.post<boolean>('ReminderScheduler', customReminderScheduler);
  }
  getReminderSchedulers(moduleReference: ModuleReference): Observable<ReminderScheduler[]> {
    const url = `ReminderScheduler/${moduleReference.application}/${moduleReference.referenceId}`;
    return this.httpClient.get<ReminderScheduler[]>(url);
  }
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('product/detail');
  }

  getCurrencies(): Observable<Currency[]> {
    return this.httpClient.get<Currency[]>('Currency');
  }

}
