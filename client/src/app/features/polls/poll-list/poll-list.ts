import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollService } from '../../../core/services/poll.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.css',
})
export class PollListComponent implements OnInit {
  private pollService = inject(PollService);
  public errorService = inject(ErrorService);

  polls = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.errorService.clearError();
    this.loadPolls();
  }

  loadPolls() {
    this.isLoading.set(true);
    this.errorService.clearError();

    this.pollService.getAllPolls().subscribe({
      next: (data) => {
        this.polls.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }
}
