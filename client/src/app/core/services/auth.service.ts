import { Injectable, signal } from '@angular/core';
import { of, delay, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // We initialize this as null, but our login method will fill it
  currentUser = signal<User | null>(null);

  login(credentials: any) {
    // We are mocking a backend response here
    const mockUser: User = {
      id: '123',
      name: 'John Doe',
      email: credentials.email || 'john@example.com',
      state: 'Lagos', // This is the state that will show on your Voter Cards
    };

    // We use 'of' to return an Observable, simulating a real HTTP call
    return of({ user: mockUser }).pipe(
      delay(800), // Simulate a short network lag
      tap((res) => {
        this.currentUser.set(res.user);
        console.log('User logged in successfully (Mock)');
      }),
    );
  }

  signup(userData: any) {
    // Same for signup - just fake a success for now
    const mockUser: User = {
      id: '124',
      name: userData.name,
      email: userData.email,
      state: userData.state,
    };

    return of({ user: mockUser }).pipe(
      delay(800),
      tap((res) => this.currentUser.set(res.user)),
    );
  }

  logout() {
    this.currentUser.set(null);
  }
}
