import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DashboardInsight } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-insights',
  standalone: true,
  templateUrl: './dashboard-insights.html',
  styleUrl: './dashboard-insights.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardInsightsComponent {
  readonly insights = input<DashboardInsight[] | null>([]);
}
