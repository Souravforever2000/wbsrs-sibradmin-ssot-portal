import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ConfidenceBucket, DiscrepancyItem, GradeDistributionItem, StatusBreakdownItem } from '../../../../core/models/api.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.css',
})
export class DashboardChartsComponent implements AfterViewInit, OnDestroy {
  @Input() gradeDistribution: GradeDistributionItem[] = [];
  @Input() statusBreakdown: StatusBreakdownItem[] = [];
  @Input() discrepancyFrequency: DiscrepancyItem[] = [];
  @Input() confidenceSpectrum: ConfidenceBucket[] = [];

  @ViewChild('gradeCanvas') private gradeCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusCanvas') private statusCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('discrepancyCanvas') private discrepancyCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('confidenceCanvas') private confidenceCanvas?: ElementRef<HTMLCanvasElement>;

  private gradeChart?: Chart<'doughnut', number[], string>;
  private statusChart?: Chart<'bar', number[], string>;
  private discrepancyChart?: Chart<'bar', number[], string>;
  private confidenceChart?: Chart<'bar', number[], string>;

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.gradeChart?.destroy();
    this.statusChart?.destroy();
    this.discrepancyChart?.destroy();
    this.confidenceChart?.destroy();
  }

  private renderCharts(): void {
    if (this.gradeCanvas && this.gradeDistribution.length) {
      this.gradeChart?.destroy();
      this.gradeChart = new Chart(this.gradeCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.gradeDistribution.map((item) => item.grade),
          datasets: [{
            data: this.gradeDistribution.map((item) => item.value),
            backgroundColor: this.gradeDistribution.map((item) => item.color),
            borderWidth: 2,
            borderColor: '#ffffff',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '56%',
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true, pointStyle: 'circle' } },
            tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed} members` } },
          },
        },
      });
    }

    if (this.statusCanvas && this.statusBreakdown.length) {
      this.statusChart?.destroy();
      this.statusChart = new Chart(this.statusCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.statusBreakdown.map((item) => item.scheme),
          datasets: [
            { label: 'Exact Match', data: this.statusBreakdown.map((item) => item.exact), backgroundColor: '#2db7b0', borderRadius: 6 },
            { label: 'Partial Match', data: this.statusBreakdown.map((item) => item.partial), backgroundColor: '#f59e0b', borderRadius: 6 },
            { label: 'Mismatch', data: this.statusBreakdown.map((item) => item.mismatch), backgroundColor: '#ef4444', borderRadius: 6 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, max: 60, grid: { color: '#edf2f7' } },
          },
          plugins: { legend: { position: 'bottom' } },
        },
      });
    }

    if (this.discrepancyCanvas && this.discrepancyFrequency.length) {
      this.discrepancyChart?.destroy();
      this.discrepancyChart = new Chart(this.discrepancyCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.discrepancyFrequency.map((item) => item.label),
          datasets: [{
            data: this.discrepancyFrequency.map((item) => item.value),
            backgroundColor: this.discrepancyFrequency.map((item) => item.color),
            borderRadius: 5,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, max: 60, grid: { color: '#edf2f7' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (this.confidenceCanvas && this.confidenceSpectrum.length) {
      this.confidenceChart?.destroy();
      this.confidenceChart = new Chart(this.confidenceCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.confidenceSpectrum.map((item) => item.label),
          datasets: [{
            data: this.confidenceSpectrum.map((item) => item.value),
            backgroundColor: this.confidenceSpectrum.map((item) => item.color),
            borderRadius: 5,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 60, grid: { color: '#edf2f7' } },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }
}
