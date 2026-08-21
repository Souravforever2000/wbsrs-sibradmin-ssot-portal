import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DistrictAnalytics } from '../../models/district.models';

@Component({
  selector: 'app-district-analytics',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './district-analytics.html',
  styleUrl: './district-analytics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictAnalyticsComponent {
  readonly district = input.required<DistrictAnalytics>();
}
