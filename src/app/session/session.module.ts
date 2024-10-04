import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [SessionComponent],
  imports: [
    CommonModule,
    SharedModule,
    SessionRoutingModule
  ]
})
export class SessionModule { }
