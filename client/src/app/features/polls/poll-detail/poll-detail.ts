import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Poll } from '../../../core/models/poll.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poll-detail',
  imports: [CommonModule],
  templateUrl: './poll-detail.html',
  styleUrl: './poll-detail.css',
})
export class PollDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  poll = signal<Poll | null>(null);
  selectedOptionId = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    const pollId = this.route.snapshot.paramMap.get('id');

    this.poll.set({
      id: pollId || '1',
      title: 'Who should be the next Chairman?',
      description:
        'Please review the candidates carefully. This vote will determine the leadership for the next 4 years. Only one vote per user is allowed.',
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdAt: new Date(),
      totalVotes: 150,
      options: [
        { id: 'opt1', text: 'Alex Johnson', votes: 0 },
        { id: 'opt2', text: 'Sarah Williams', votes: 0 },
        { id: 'opt3', text: 'Michael Chen', votes: 0 },
      ],
    });
  }

  selectOption(optionId: string) {
    this.selectedOptionId.set(optionId);
  }

  submitVote() {
    if (!this.selectedOptionId()) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      alert('Vote cast successfully!');
      this.router.navigate(['/polls']);
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/polls']);
  }
}
