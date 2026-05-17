import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Closed';
  options: any[];
  endsAt: string;
  userHasVoted: boolean;
  voteCount?: number;
}

@Injectable({ providedIn: 'root' })
export class PollService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/polls`;

  getAllPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.API_URL);
  }

  getPollById(id: string): Observable<Poll> {
    return this.http.get<Poll>(`${this.API_URL}/${id}`);
  }

  getPollResults(pollId: string): Observable<any> {
    return this.http.get<Poll>(`${this.API_URL}/${pollId}/result`);
  }

  getVoterCountByState(state: string, pollId: string) {
    return this.http.get<number>(`${this.API_URL}/voter-by-state?state=${state}`);
  }

  vote(pollId: string, optionId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${pollId}/vote/${optionId}`, {});
  }

  createPoll(pollData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/create`, pollData);
  }

  updatePoll(id: string, pollData: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}`, pollData);
  }

  deletePoll(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
