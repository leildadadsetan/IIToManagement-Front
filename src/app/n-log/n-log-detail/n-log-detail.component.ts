import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NLog } from '@core/domain-classes/n-log';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-n-log-detail',
  templateUrl: './n-log-detail.component.html',
  styleUrls: ['./n-log-detail.component.scss']
})
export class NLogDetailComponent extends BaseComponent implements OnInit {
  log: NLog;
  constructor(private activeRoute: ActivatedRoute,public translationService:TranslationService) {
    super(translationService);
   
  }

  ngOnInit(): void {
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { log: NLog }) => {
        if (data.log) {
          this.log = data.log;
        }
      });
  }
}
