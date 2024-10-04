import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitConversationListComponent } from './unit-conversation-list/unit-conversation-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: UnitConversationListComponent,
    canActivate: [AuthGuard],
   data: { claimType: 'PRO_MANAGE_UNIT' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UnitConversationRoutingModule { }
