import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const appState = new BehaviorSubject(false);
const token = localStorage.getItem('access_token', access_token);
@Injectable()
export class AuthService {
  constructor() {}

  isloggedIn() {
    if (!token) {
      return;
    }

    appState.next(true); //the auth guard will check if this token matches the jwt the baxkend returns
  }

  login() {}

  logout() {}
}
