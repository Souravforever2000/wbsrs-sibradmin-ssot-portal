import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.css',
})
export class DashboardChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trendCanvas') private trendCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('coverageCanvas') private coverageCanvas?: ElementRef<HTMLCanvasElement>;
  private trendChart?: Chart;
  private coverageChart?: Chart;

  ngAfterViewInit(): void {
    this.createTrendChart();
    this.createCoverageChart();
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
    this.coverageChart?.destroy();
  }

  private createTrendChart(): void {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: { labels: ['2022', '2023', '2024', '2025', '2026'], datasets: [{ data: [26.1, 28.7, 31.4, 33.3, 36.1], label: 'Active beneficiaries (L)', borderColor: '#246be8', backgroundColor: 'rgba(36,107,232,.14)', fill: true, tension: .38, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { displayColors: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8493a7', font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: '#edf1f6' }, ticks: { color: '#8493a7', font: { size: 10 }, callback: (value) => `${value}L` } } } },
    };
    if (this.trendCanvas) this.trendChart = new Chart(this.trendCanvas.nativeElement, config);
  }

  private createCoverageChart(): void {
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: { labels: ['PM-KISAN', 'NFSA', 'MGNREGA', 'NSAP', 'Health'], datasets: [{ data: [88, 82, 76, 68, 61], backgroundColor: ['#246be8', '#12b789', '#8158e4', '#f59e0b', '#0aa697'], borderRadius: 6, barThickness: 22 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw}% coverage` } } }, scales: { x: { beginAtZero: true, max: 100, grid: { color: '#edf1f6' }, ticks: { color: '#8493a7', font: { size: 9 }, callback: (value) => `${value}%` } }, y: { grid: { display: false }, ticks: { color: '#657a98', font: { size: 10 } } } } },
    };
    if (this.coverageCanvas) this.coverageChart = new Chart(this.coverageCanvas.nativeElement, config);
  }
}
