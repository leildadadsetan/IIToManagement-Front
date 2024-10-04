import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptorModule } from './http-interceptor.module';
import { AppStoreModule } from './store/app-store.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingInterceptorModule } from '@shared/loading-indicator/pending-interceptor.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { createTranslateLoader } from './translater-loader';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { TranslationService } from '@core/services/translation.service';
import { delayBootstrapping } from './boostrap-loader';
import { DOCUMENT } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpInterceptorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    AppStoreModule,
    PendingInterceptorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastrModule.forRoot(),
  ],
  providers:[
    {
      provide:APP_INITIALIZER,
      useFactory: delayBootstrapping,
      deps:[TranslationService,DOCUMENT,TranslateService],
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
