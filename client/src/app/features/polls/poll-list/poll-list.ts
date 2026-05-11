import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Poll } from '../../../core/models/poll.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-list',
  imports: [CommonModule],
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.css',
})
export class PollListComponent {
  private router = inject(Router);
  polls = signal<Poll[]>([
    {
      id: '1',
      title: 'Who should be the next Chairman?',
      description: 'We want to know who should be chiarmain',
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Ends in 24 hours
      createdAt: new Date(),
      userHasVoted: false,
      totalVotes: 150,
      options: [],
    },
    {
      id: '2',
      title: 'Vote for the new Community Project',
      description: 'Tell us your thoughts about the community project',
      endsAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // Closed 5 hours ago
      createdAt: new Date(),
      userHasVoted: false,
      totalVotes: 1200,
      options: [],
    },
  ]);

  getPollStatus(endDate: Date) {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const isClosed = diff <= 0;

    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (isClosed) {
      return {
        label: `Closed ${days > 0 ? days + 'd' : hours + 'h'} ago`,
        cssClass: 'status-closed',
        active: false,
      };
    }

    return {
      label: `Ends in ${days > 0 ? days + 'd' : hours + 'h'}`,
      cssClass: 'status-active',
      active: true,
    };
  }

  goToPoll(id: string) {
    this.router.navigate(['polls', id]);
  }
}
