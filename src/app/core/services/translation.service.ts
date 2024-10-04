// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { Subject } from '@microsoft/signalr';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
  private langIds: any = [];
  private _lanDir: BehaviorSubject<string> = new BehaviorSubject<string>('ltr')


  public get lanDir$() : Observable<string> {
    return this._lanDir.asObservable();
  }



  constructor(private translate: TranslateService) {
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];
    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  setLanguage(lang) {
    try {
      if (lang) {
        localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
        if(lang ==='ar'){
          this._lanDir.next('rtl');
        } else {
          this._lanDir.next('ltr')
        }
        return this.translate.use(lang);
      }
    }
    catch {
      return of(null);
    }
  }

  removeLanguage() {
    try {
      localStorage.removeItem(LOCALIZATION_LOCAL_STORAGE_KEY);
    }
    catch {

    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    try {
      if (localStorage) {
        return  localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY)
      }
      return null;
    }
    catch {
      return null;
    }
  }

  getValue(key: string) {
    return this.translate.instant(key);
  }
}
