import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonDialogService } from './common-dialog/common-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from '@shared/loading-indicator/loading-indicator.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonErrorHandlerService } from './error-handler/common-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { ControlSidebarComponent } from './control-sidebar/control-sidebar.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ControlSidebarComponent,
    CommonDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    RouterModule,
    SharedModule,
    MatTooltipModule,
    LoadingIndicatorModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    LayoutComponent
  ],
  providers: [
    CommonDialogService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: ErrorHandler, useClass: CommonErrorHandlerService,
      deps: [HttpClient]
    }
  ]
})
export class CoreModule { }
