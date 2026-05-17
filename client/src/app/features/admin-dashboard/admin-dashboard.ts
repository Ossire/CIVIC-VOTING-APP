import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PollService } from '../../core/services/poll.service';
import { ErrorService } from '../../core/services/error.service';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../core/services/user-management.service';

interface PollRecord {
  id: string;
  title: string;
  endsAt: string;
  options?: any[];
  status?: 'Active' | 'Closed';
  voteCount?: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private pollService = inject(PollService);
  private userService = inject(UserManagementService);
  private router = inject(Router);
  public errorService = inject(ErrorService);

  polls = signal<PollRecord[]>([]);
  isLoading = signal(false);

  totalRegisteredVoters = signal(0);
  selectedState = signal('');
  stateFilterResult = signal<{ count: number; pct: number } | null>(null);

  nigerianStates: string[] = [
    'Abia',
    'Abuja',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  totalPollsCount = computed(() => this.polls().length);

  activePollsCount = computed(() => {
    return this.polls().filter((p) => p.status === 'Active').length;
  });

  closedPollsCount = computed(() => {
    return this.polls().filter((p) => p.status === 'Closed').length;
  });

  totalVotesCast = computed(() => {
    return this.polls().reduce((sum, p) => sum + (p.voteCount || 0), 0);
  });

  ngOnInit() {
    this.errorService.clearError();
    this.loadPolls();
    this.loadTotalVoterCount();
  }

  loadTotalVoterCount() {
    this.userService.getEligibleVoterCount().subscribe({
      next: (count) => this.totalRegisteredVoters.set(count),
      error: (err) => this.errorService.handleError(err),
    });
  }

  loadPolls() {
    this.isLoading.set(true);
    this.pollService.getAllPolls().subscribe({
      next: (data: PollRecord[]) => {
        const mappedPolls = data.map((p) => ({
          ...p,
          status: (new Date(p.endsAt) > new Date() ? 'Active' : 'Closed') as 'Active' | 'Closed',
          voteCount: p.voteCount || 0,
        }));
        this.polls.set(mappedPolls);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  onFilterState() {
    const state = this.selectedState();
    if (!state) return;

    this.userService.getCountUsersByState(state).subscribe({
      next: (count) => {
        const total = this.totalRegisteredVoters();

        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        this.stateFilterResult.set({ count, pct });
      },
      error: (err) => this.errorService.handleError(err),
    });
  }

  onToggleStatus(poll: PollRecord) {
    if (poll.status === 'Closed') return;
    if (confirm(`Close "${poll.title}"?`)) {
      const payload = { endsAt: new Date().toISOString() };
      this.pollService.updatePoll(poll.id, payload).subscribe({
        next: () => this.loadPolls(),
        error: (err) => this.errorService.handleError(err),
      });
    }
  }

  onEdit(poll: PollRecord) {
    if (poll.status === 'Closed' || (poll.voteCount || 0) > 0) return;
    this.router.navigate(['/admin/edit-poll', poll.id]);
  }

  onDelete(id: string) {
    if (confirm('Delete permanently?')) {
      this.pollService.deletePoll(id).subscribe({
        next: () => this.polls.update((curr) => curr.filter((p) => p.id !== id)),
        error: (err) => this.errorService.handleError(err),
      });
    }
  }
}
