import { Direction } from '@angular/cdk/bidi';
import { Component, OnDestroy } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-base',
  template: ``
})
export class BaseComponent implements OnDestroy {
  sub$: SubSink;
  langDir: Direction = 'ltr';
  constructor(public translationService?: TranslationService) {
    this.sub$ = new SubSink();
  }

  getLangDir() {
    this.sub$.sink = this.translationService.lanDir$.subscribe((c: Direction) => {
      this.langDir = c;
    })
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

}
