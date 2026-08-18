import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly detail = input<string>('');
  readonly trend = input<string>('');
  readonly tone = input<'blue' | 'green' | 'amber' | 'red'>('blue');
  readonly icon = input('insights');
}
