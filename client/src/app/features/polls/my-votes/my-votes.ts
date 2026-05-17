import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService } from '../../../core/services/poll.service';
import { ErrorService } from '../../../core/services/error.service';
import { RouterLink } from '@angular/router';
import { UserManagementService } from '../../../core/services/user-management.service';

@Component({
  selector: 'app-my-votes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-votes.html',
  styleUrl: './my-votes.css',
})
export class MyVotesComponent implements OnInit {
  private pollService = inject(PollService);
  private userService = inject(UserManagementService);
  public errorService = inject(ErrorService);

  history = signal<any[]>([]);
  isLoading = signal(true);
  expandedPollId = signal<string | null>(null);

  ngOnInit() {
    this.errorService.clearError();
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading.set(true);
    this.userService.getUserHistory().subscribe({
      next: (data) => {
        this.history.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  toggleExpand(id: string) {
    this.expandedPollId.update((current) => (current === id ? null : id));
  }
}
