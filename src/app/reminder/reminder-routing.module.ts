import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { ReminderDetailResolverService } from './add-reminder/reminder-detail.resolver';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReminderListComponent,
    data: { claimType: 'REM_VIEW_REMINDERS' },
    canActivate: [AuthGuard],
  }, {
    path: 'add',
    component: AddReminderComponent,
    data: { claimType: 'REM_ADD_REMINDER' },
    canActivate: [AuthGuard],
  }, {
    path: 'manage/:id',
    resolve: { reminder: ReminderDetailResolverService },
    component: AddReminderComponent,
    data: { claimType: 'REM_UPDATE_REMINDER' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ], exports: [RouterModule]
})
export class ReminderRoutingModule { }
