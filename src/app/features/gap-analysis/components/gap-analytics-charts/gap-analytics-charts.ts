import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, SimpleChanges, input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { GapConfidenceDistribution, GapTypeFrequency, GeographicGapAnalysis, SchemeGapDistribution } from '../../models/gap-analysis.model';

Chart.register(...registerables);

@Component({ selector: 'app-gap-analytics-charts', standalone: true, templateUrl: './gap-analytics-charts.html', styleUrl: './gap-analytics-charts.css' })
export class GapAnalyticsChartsComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly discrepancyFrequency = input<GapTypeFrequency[]>([]);
  readonly schemeDistribution = input<SchemeGapDistribution[]>([]);
  readonly confidenceDistribution = input<GapConfidenceDistribution[]>([]);
  readonly geographicDistribution = input<GeographicGapAnalysis[]>([]);
  @ViewChild('frequencyCanvas') private frequencyCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('schemeCanvas') private schemeCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('confidenceCanvas') private confidenceCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('geographicCanvas') private geographicCanvas?: ElementRef<HTMLCanvasElement>;
  private charts: Chart[] = [];

  ngAfterViewInit(): void { this.render(); }
  ngOnChanges(_: SimpleChanges): void { if (this.frequencyCanvas) this.render(); }
  ngOnDestroy(): void { this.destroy(); }

  private render(): void {
    this.destroy();
    if (this.frequencyCanvas && this.discrepancyFrequency().length) this.charts.push(new Chart(this.frequencyCanvas.nativeElement, { type: 'bar', data: { labels: this.discrepancyFrequency().map((item) => item.type), datasets: [{ data: this.discrepancyFrequency().map((item) => item.count), backgroundColor: ['#c2410c', '#ea580c', '#f59e0b'], borderRadius: 6, barThickness: 18 }] }, options: this.options('y') }));
    if (this.schemeCanvas && this.schemeDistribution().length) this.charts.push(new Chart(this.schemeCanvas.nativeElement, { type: 'bar', data: { labels: this.schemeDistribution().map((item) => item.schemeName), datasets: [{ label: 'Critical', data: this.schemeDistribution().map((item) => item.critical), backgroundColor: '#9a3412', borderRadius: 5 }, { label: 'Moderate', data: this.schemeDistribution().map((item) => item.moderate), backgroundColor: '#ea580c', borderRadius: 5 }, { label: 'Low', data: this.schemeDistribution().map((item) => item.low), backgroundColor: '#f59e0b', borderRadius: 5 }] }, options: { ...this.options(), scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, grid: { color: '#edf2f4' } } } } }));
    if (this.confidenceCanvas && this.confidenceDistribution().length) this.charts.push(new Chart(this.confidenceCanvas.nativeElement, { type: 'bar', data: { labels: this.confidenceDistribution().map((item) => item.range), datasets: [{ data: this.confidenceDistribution().map((item) => item.count), backgroundColor: ['#9a3412', '#c2410c', '#ea580c', '#f59e0b', '#fdba74'], borderRadius: 6, barThickness: 24 }] }, options: this.options() }));
    if (this.geographicCanvas && this.geographicDistribution().length) this.charts.push(new Chart(this.geographicCanvas.nativeElement, { type: 'bar', data: { labels: this.geographicDistribution().map((item) => item.name), datasets: [{ data: this.geographicDistribution().map((item) => item.totalGaps), backgroundColor: '#c2410c', borderRadius: 6, barThickness: 22 }] }, options: this.options() }));
  }

  private options(indexAxis?: 'x' | 'y') { return { indexAxis, responsive: true, maintainAspectRatio: false, plugins: { legend: { display: indexAxis !== 'y', position: 'bottom' as const }, tooltip: { enabled: true } }, scales: { x: { beginAtZero: true, grid: { color: '#edf2f4' } }, y: { beginAtZero: true, grid: { color: '#edf2f4' } } } }; }
  private destroy(): void { this.charts.forEach((chart) => chart.destroy()); this.charts = []; }
}
