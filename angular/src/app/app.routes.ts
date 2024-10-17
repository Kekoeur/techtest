import { Routes } from '@angular/router';

import { UserListComponent } from './users/list/user-list.component';
import { UserAddComponent } from './users/add/user-add.component';
import { AppSocialComponent } from './social/social.component';

export const routes: Routes = [
  { path: '', component: AppSocialComponent },
  { path: 'users', component: UserListComponent },
  { path: 'user/add', component: UserAddComponent }
];
