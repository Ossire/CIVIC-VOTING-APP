import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  votingHistory = signal([
    {
      id: '1',
      title: 'CHAIRMAN ELECTION RESULTS',
      date: 'May 10, 2026',
      time: '02:15 PM',
      selection: 'Alex Johnson',
      refId: 'VC-8821-X9',
      status: 'Closed',
    },
    {
      id: '2',
      title: 'COMMUNITY INFRASTRUCTURE VOTE',
      date: 'April 15, 2026',
      time: '09:30 AM',
      selection: 'New Park Addition',
      refId: 'VC-4402-L2',
      status: 'Active',
    },
  ]);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
