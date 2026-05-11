import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup';
import { LoginComponent } from './features/login/login';
import { HomeComponent } from './features/home/home';
import { PollListComponent } from './features/polls/poll-list/poll-list';
import { PollDetailComponent } from './features/polls/poll-detail/poll-detail';
import { ProfileComponent } from './features/profile/profile';
import { authGuard } from './core/guards/auth.guard';
import { PollResultComponent } from './features/polls/poll-results/poll-results';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'polls', component: PollListComponent, canActivate: [authGuard] },
  {
    path: 'polls/:id',
    component: PollDetailComponent,
    canActivate: [authGuard],
  },

  { path: 'results', component: PollResultComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
];
