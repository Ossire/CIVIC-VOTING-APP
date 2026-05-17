import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  private http = inject(HttpClient);
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  constructor() {
    this.rehydrateUser();
  }
  private rehydrateUser() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          this.logout();
          return;
        }

        this.currentUser.set({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          state: decoded.state,
        });

        console.log(this.currentUser());
      } catch (e) {
        this.logout();
      }
    }
  }
  signup(signupData: any) {
    return this.http
      .post<AuthResponse>(`${this.AUTH_URL}/signup`, signupData)
      .pipe(tap((res) => this.setSession(res)));
  }

  login(credentials: { email: string; password: any }) {
    return this.http
      .post<AuthResponse>(`${this.AUTH_URL}/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.access_token);
    try {
      const decoded: any = jwtDecode(authResult.access_token);

      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        state: decoded.state,
      };

      this.currentUser.set(user);
    } catch (error) {
      console.error('Invalid token format', error);
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
