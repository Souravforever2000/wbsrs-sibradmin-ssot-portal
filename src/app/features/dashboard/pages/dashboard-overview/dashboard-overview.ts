import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GlobalFiltersComponent } from '../../../../shared/components/global-filters/global-filters';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card';
import { PageHeadingComponent } from '../../../../shared/components/page-heading/page-heading';

import { DashboardChartsComponent } from '../../components/dashboard-charts/dashboard-charts';
import { DashboardInsightsComponent } from '../../components/dashboard-insights/dashboard-insights';
import { DistrictPerformanceComponent } from '../../components/district-performance/district-performance';
import { StateOverviewComponent } from '../../components/state-overview/state-overview';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    GlobalFiltersComponent,
    KpiCardComponent,
    PageHeadingComponent,
    DashboardChartsComponent,
    DashboardInsightsComponent,
    DistrictPerformanceComponent,
    StateOverviewComponent,
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOverviewPage {
  private readonly service = inject(DashboardService);

  readonly dashboard$ = this.service.getDashboard();
  readonly insights$ = this.service.getInsights();
  readonly performance$ = this.service.getDistrictPerformance();
}
