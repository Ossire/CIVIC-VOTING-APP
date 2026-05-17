import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollService, Poll } from '../../../core/services/poll.service';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poll-detail.html',
  styleUrl: './poll-detail.css',
})
export class PollDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private router = inject(Router);
  private authService = inject(AuthService);
  public errorService = inject(ErrorService);

  poll = signal<Poll | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  selectedOptionId = signal<number | null>(null);
  userHasVoted = signal(false);

  justVoted = signal(false);

  isClosed = computed(() => {
    const p = this.poll();
    return p ? new Date() > new Date(p.endsAt) : false;
  });

  ngOnInit(): void {
    this.errorService.clearError();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPollDetail(id);
    }
  }

  loadPollDetail(id: string) {
    this.isLoading.set(true);
    this.errorService.clearError();

    this.pollService.getPollById(id).subscribe({
      next: (data) => {
        this.poll.set(data);
        this.userHasVoted.set(data.userHasVoted ?? false);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  selectOption(id: number) {
    if (this.userHasVoted() || this.isClosed()) return;
    this.selectedOptionId.set(id);
  }

  onCastVote() {
    const currentPoll = this.poll();
    const optionId = this.selectedOptionId();

    if (!currentPoll || !optionId) return;

    this.isSubmitting.set(true);
    this.errorService.clearError();

    this.pollService.vote(currentPoll.id, optionId).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.userHasVoted.set(true);
        this.justVoted.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/polls']);
  }
}
