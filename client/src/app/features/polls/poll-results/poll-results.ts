import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PollService } from '../../../core/services/poll.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ErrorService } from '../../../core/services/error.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NIGERIAN_STATES } from '../../../core/constants/states';

@Component({
  selector: 'app-poll-results',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective, FormsModule],
  templateUrl: './poll-results.html',
  styleUrl: './poll-results.css',
})
export class PollResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private authService = inject(AuthService);
  private userService = inject(UserManagementService);
  public errorService = inject(ErrorService);

  pollId = signal<string | null>(null);
  resultsData = signal<any>(null);
  isLoading = signal(true);
  totalEligibleUsers = signal(0);

  selectedFilterState = signal<string>('');
  stateStats = signal<{ votedInState: number; totalInState: number } | null>(null);

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

  userRole = computed(() => this.authService.currentUser()?.role || 'user');

  isClosed = computed(() => {
    const data = this.resultsData();
    return data ? new Date() > new Date(data.endsAt) : false;
  });

  winner = computed(() => {
    const data = this.resultsData();
    if (!data || data.totalVotes === 0) return null;
    const results = [...data.results].sort((a, b) => b.voteCount - a.voteCount);
    const maxVotes = results[0].voteCount;
    const leaders = results.filter((r) => r.voteCount === maxVotes);
    if (leaders.length > 1) {
      return {
        isTie: true,
        text: leaders.map((l) => l.text).join(' & '),
        winnerPercentage: ((maxVotes / data.totalVotes) * 100).toFixed(1),
      };
    }
    return {
      isTie: false,
      ...results[0],
      winnerPercentage: ((results[0].voteCount / data.totalVotes) * 100).toFixed(1),
    };
  });

  participationPct = computed(() => {
    const data = this.resultsData();
    if (!data || this.totalEligibleUsers() <= 0) return 0;
    return Math.min(Math.round((data.totalVotes / this.totalEligibleUsers()) * 100), 100);
  });

  getStatePct(stats: { votedInState: number; totalInState: number }): string {
    if (!stats || stats.totalInState === 0) return '0.0';

    return ((stats.votedInState / stats.totalInState) * 100).toFixed(1);
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pollId.set(id);
      this.loadResults(id);
      this.loadVoterContext();
    }
  }

  loadVoterContext() {
    this.userService.getEligibleVoterCount().subscribe({
      next: (count) => this.totalEligibleUsers.set(count),
      error: (err) => this.errorService.handleError(err),
    });
  }

  loadResults(pollId: string) {
    this.isLoading.set(true);
    this.pollService.getPollResults(pollId).subscribe({
      next: (data) => {
        this.resultsData.set(data);
        this.barChartData = {
          labels: data.results.map((r: any) => r.text),
          datasets: [
            {
              data: data.results.map((r: any) => r.voteCount),
              backgroundColor: '#a855f7',
              borderRadius: 8,
              barThickness: 35,
            },
          ],
        };
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  onStateFilterChange() {
    const state = this.selectedStateAsEnum();
    if (!state) {
      this.stateStats.set(null);
      return;
    }
    this.userService.getVoterCountByState(state, this.pollId()!).subscribe({
      next: (res: any) => this.stateStats.set(res),
      error: (err) => this.errorService.handleError(err),
    });
  }

  private selectedStateAsEnum(): any {
    return this.selectedFilterState() || null;
  }
}
