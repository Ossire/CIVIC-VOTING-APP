import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-poll-results',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './poll-results.html',
  styleUrl: './poll-results.css',
})
export class PollResultComponent implements OnInit {
  pollTitle = signal('CHAIRMAN ELECTION 2026');
  totalVotes = signal(4500);

  // Overall Results Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, grid: { color: '#f0f0f0' } },
    },
    plugins: {
      legend: { display: false },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Alex Johnson', 'Sarah Williams', 'Michael Chen'],
    datasets: [
      {
        data: [2100, 1800, 600],
        backgroundColor: '#4f46e5', // Indigo!
        hoverBackgroundColor: '#4338ca',
        borderRadius: 6,
      },
    ],
  };

  // State-by-State Analysis Data
  stateBreakdown = signal([
    { state: 'Lagos', candidateA: 800, candidateB: 200, candidateC: 50 },
    { state: 'Abuja', candidateA: 400, candidateB: 500, candidateC: 100 },
    { state: 'Rivers', candidateA: 300, candidateB: 600, candidateC: 200 },
    { state: 'Kano', candidateA: 600, candidateB: 500, candidateC: 250 },
  ]);

  ngOnInit() {}
}
