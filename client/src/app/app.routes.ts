import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/roles.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/signup/signup').then((m) => m.SignupComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },

  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'polls',
    loadComponent: () =>
      import('./features/polls/poll-list/poll-list').then((m) => m.PollListComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'polls/:id',
    loadComponent: () =>
      import('./features/polls/poll-detail/poll-detail').then((m) => m.PollDetailComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'my-votes',
    loadComponent: () =>
      import('./features/polls/my-votes/my-votes').then((m) => m.MyVotesComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'user' },
  },

  {
    path: 'result/:id',
    loadComponent: () =>
      import('./features/polls/poll-results/poll-results').then((m) => m.PollResultsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/create-poll',
    loadComponent: () =>
      import('./features/create-poll/create-poll').then((m) => m.CreatePollComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/edit-poll/:id',
    loadComponent: () =>
      import('./features/create-poll/create-poll').then((m) => m.CreatePollComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/error-page/error-page').then((m) => m.ErrorPageComponent),
  },
];
