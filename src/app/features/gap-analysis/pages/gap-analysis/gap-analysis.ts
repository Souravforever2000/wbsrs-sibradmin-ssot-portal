import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FuzzyHeaderComponent } from '../../../fuzzy-match/components/fuzzy-header/fuzzy-header';
import { GlobalFiltersComponent } from '../../../../shared/components/global-filters/global-filters';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card';
import { FilterStateService } from '../../../../shared/services/filter-state.service';
import { GapAnalyticsChartsComponent } from '../../components/gap-analytics-charts/gap-analytics-charts';
import { GapAnalysisService } from '../../services/gap-analysis.service';
import { GapRecord, GapAnalysisSnapshot } from '../../models/gap-analysis.model';

@Component({ selector: 'app-gap-analysis', standalone: true, imports: [CommonModule, FuzzyHeaderComponent, GlobalFiltersComponent, KpiCardComponent, GapAnalyticsChartsComponent], templateUrl: './gap-analysis.html', styleUrl: './gap-analysis.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class GapAnalysisPage {
  private readonly service = inject(GapAnalysisService);
  private readonly filterState = inject(FilterStateService);
  readonly snapshot = signal<GapAnalysisSnapshot | null>(null);
  readonly selected = signal<GapRecord | null>(null);
  readonly activeTab = signal('All Discrepancies');
  readonly threshold = signal(75);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly rows = computed(() => {
    const rows = this.snapshot()?.records ?? [];
    if (this.activeTab() === 'Gender Mismatches') return rows.filter((row) => row.trigger.includes('Gender'));
    if (this.activeTab() === 'DOB Variances') return rows.filter((row) => row.trigger.includes('DOB'));
    if (this.activeTab() === 'Low Confidence Score') return rows.filter((row) => row.confidence < 60);
    return rows;
  });
  readonly summary = computed(() => this.snapshot()?.summary ?? { totalDiscrepancies: 0, highPriorityGaps: 0, averageConfidence: 0, affectedMembers: 0 });
  readonly tabCounts = computed(() => this.snapshot()?.tabCounts ?? { all: 0, genderMismatch: 0, dobVariance: 0, lowConfidence: 0 });
  readonly confidenceTone = computed<'blue' | 'green' | 'amber' | 'red'>(() => this.summary().averageConfidence >= 85 ? 'green' : this.summary().averageConfidence >= 60 ? 'amber' : 'red');

  constructor() {
    effect((onCleanup) => {
      const filters = this.filterState.filters();
      this.loading.set(true);
      this.error.set(false);
      const subscription = this.service.getOverview(filters).subscribe({ next: (snapshot) => { this.snapshot.set(snapshot); this.loading.set(false); }, error: () => { this.error.set(true); this.loading.set(false); } });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  setThreshold(value: number): void { this.threshold.set(value); }
  inspect(row: GapRecord): void { this.selected.set(row); }
  close(): void { this.selected.set(null); }
  refresh(): void { this.service.refresh().subscribe(() => this.filterState.update({ ...this.filterState.filters() })); }
}
