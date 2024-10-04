import {Component, Directive, NgModule, ElementRef, Renderer2, ViewChild} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { TranslationService } from '@core/services/translation.service';

@Directive({
  selector: '[lang-dir]'
})
export class LangDirDirective {

  constructor (private _elRef: ElementRef, private _renderer: Renderer2,
    public translationService: TranslationService) { console.log('!'); }

  ngOnInit() {
    // this.translationService.lanDir$.subscribe(c=>{
      this._renderer.setAttribute(this._elRef.nativeElement, 'dir', 'rtl');
    // });
  }

}
