import { NgModule } from '@angular/core';
import { GroupCategoryListComponent } from './group-category-list/group-category-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: GroupCategoryListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'GR_MANAGE_GROUPS' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupCategoryRoutingModule { }
