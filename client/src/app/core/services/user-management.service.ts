import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NIGERIAN_STATES } from '../constants/states';

export interface UserActivity {
  pollTitle: string;
  choice: string;
  pollStatus: 'Active' | 'Closed';
  createdAt: string;
}

export interface Citizen {
  id: string;
  name: string;
  email: string;
  state: string;
  role: 'admin' | 'user';
  votes: {
    poll: { title: string; endsAt: string; status: 'active' | 'closed' };
    choice: { text: string };
    createdAt: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  NigerianStates = NIGERIAN_STATES;

  getAllUsersWithActivity(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(`${this.API_URL}/audit`);
  }
  getUserHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/polls/user/history`);
  }

  getEligibleVoterCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count-eligible`);
  }

  getCountUsersByState(state: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count-by-state?state=${state}`);
  }
  getVoterCountByState(
    state: string,
    pollId: string,
  ): Observable<{ votedInState: number; totalInState: number }> {
    return this.http.get<{ votedInState: number; totalInState: number }>(
      `${this.API_URL}/voter-by-state?state=${state}&pollId=${pollId}`,
    );
  }
}
