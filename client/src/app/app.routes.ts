import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup';
import { LoginComponent } from './features/login/login';
import { HomeComponent } from './features/home/home';
import { PollListComponent } from './features/polls/poll-list/poll-list';
import { PollDetailComponent } from './features/polls/poll-detail/poll-detail';
import { ProfileComponent } from './features/profile/profile';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/roles.guard';
import { PollResultsComponent } from './features/polls/poll-results/poll-results';
import { CreatePollComponent } from './features/create-poll/create-poll';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard';
import { MyVotesComponent } from './features/polls/my-votes/my-votes';
import { ErrorPageComponent } from './features/error-page/error-page';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  {
    path: 'polls',
    component: PollListComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'polls/:id',
    component: PollDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'my-votes',
    component: MyVotesComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },

  { path: 'result/:id', component: PollResultsComponent, canActivate: [authGuard] },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/create-poll',
    component: CreatePollComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/edit-poll/:id',
    component: CreatePollComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },

  { path: '**', component: ErrorPageComponent },
];
