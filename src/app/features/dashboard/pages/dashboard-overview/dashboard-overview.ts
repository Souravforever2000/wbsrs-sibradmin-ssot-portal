import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalFiltersComponent } from '../../../../shared/components/global-filters/global-filters';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card';
import { PageHeadingComponent } from '../../../../shared/components/page-heading/page-heading';
import { DashboardChartsComponent } from '../../components/dashboard-charts/dashboard-charts';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, GlobalFiltersComponent, KpiCardComponent, PageHeadingComponent, DashboardChartsComponent],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverviewPage {
  readonly service = inject(DashboardService);
  readonly summary$ = this.service.getSummary();
  readonly insights$ = this.service.getInsights();
  readonly performance$ = this.service.getDistrictPerformance();
}
