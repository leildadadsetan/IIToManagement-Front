import { DOCUMENT } from "@angular/common";
import { TranslationService } from "@core/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "./base.component";
export function delayBootstrapping(translationService:TranslationService, document: Document, translate: TranslateService ): ()=> Promise<void>{
 return ()=> new Promise<void>((resolve,reject)=>{
  setTimeout(()=>{
      new BoostrapLoader(translationService, document,translate);
      resolve();
    },500);
})
}

export class BoostrapLoader extends BaseComponent{
  constructor(public translationService:TranslationService, public document: Document, public translate: TranslateService) {
    super(translationService);
    translate.addLangs(['en', 'es', 'ar', 'ru', 'cn', 'ja', 'ko']);
    this.setLanguage();
  }
  setLanguage() {
    let currentLang = this.translationService.getSelectedLanguage();
    if (currentLang) {
      this.sub$.sink = this.translationService.setLanguage(currentLang)
        .subscribe(() => { });
    }
    else {
      const browserLang = this.translate.getBrowserLang();
      currentLang = browserLang.match(/en|es|ar|ru|cn|ja|ko/) ? browserLang : 'en';
      this.sub$.sink = this.translationService.setLanguage(currentLang).subscribe(() => { });
    }
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

}
