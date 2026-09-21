import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalFiltersComponent } from '../global-filters/global-filters';
import { PageHeadingComponent } from '../page-heading/page-heading';
import { StateOverviewComponent } from '../../../features/dashboard/components/state-overview/state-overview';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { DISTRICT_PROFILES } from '../../../features/dashboard/data/district-profiles';
import { DistrictAnalytics } from '../../../features/dashboard/models/district.models';
import { SchemeMasterAggregate } from '../../../features/dashboard/models/scheme.models';
import { SCHEME_AGGREGATES } from '../../../features/dashboard/models/scheme-aggregates-data';
import { FilterStateService } from '../../services/filter-state.service';

interface WorkspaceConfig {
  title: string;
  eyebrow: string;
  description: string;
  primaryMetric: string;
  primaryLabel: string;
  accent: string;
  columns: string[];
  rows: string[][];
  bars: { label: string; value: number; tone: string }[];
  notes: string[];
}

interface SortState {
  columnIndex: number;
  direction: 'asc' | 'desc';
}

const configs: Record<string, WorkspaceConfig> = {
  analytics: { title: 'Analytics Overview', eyebrow: 'ANALYTICS · TRENDS & COMPARISONS', description: 'Compare state, district and scheme performance using pre-aggregated analytical metrics.', primaryMetric: '8.4%', primaryLabel: 'Beneficiary growth YoY', accent: 'blue', columns: ['Metric', 'Current year', 'Previous year', 'Change'], rows: [['Total beneficiaries', '3.61 Cr', '3.33 Cr', '+8.4%'], ['Average schemes / citizen', '2.7', '2.4', '+12.5%'], ['Citizens with no scheme', '28.3%', '30.1%', '-1.8 pp'], ['Multi-scheme citizens', '42.6 L', '37.9 L', '+12.4%']], bars: [{ label: 'Kolkata', value: 98, tone: 'blue' }, { label: 'Nadia', value: 97, tone: 'green' }, { label: 'Hooghly', value: 95, tone: 'green' }, { label: 'Malda', value: 75, tone: 'amber' }, { label: 'Purulia', value: 71, tone: 'red' }], notes: ['District performance is ranked on coverage, growth and scheme diversity.', 'YoY metrics compare the same financial-year period.', 'Charts are sourced from the analytics aggregate layer.'] },
  growth: { title: 'Growth Analysis', eyebrow: 'ANALYTICS · GROWTH', description: 'Understand where beneficiary and enrollment growth is accelerating or declining.', primaryMetric: '+12.1%', primaryLabel: 'Highest district growth', accent: 'green', columns: ['Area', 'Beneficiaries', 'YoY growth', 'Trend'], rows: [['Kolkata', '4.8 L', '+12.1%', 'Accelerating'], ['Nadia', '8.1 L', '+9.8%', 'Healthy'], ['Hooghly', '7.3 L', '+7.4%', 'Stable'], ['Malda', '6.2 L', '-3.4%', 'Declining'], ['Purulia', '4.1 L', '-5.8%', 'Declining']], bars: [{ label: 'Kolkata', value: 92, tone: 'green' }, { label: 'Nadia', value: 80, tone: 'green' }, { label: 'Hooghly', value: 63, tone: 'blue' }, { label: 'Malda', value: 32, tone: 'amber' }, { label: 'Purulia', value: 25, tone: 'red' }], notes: ['Growth is calculated as (current period - previous period) / previous period × 100.', 'Declines are flagged when the change is below -2%.', 'Use the global filters to compare a scheme, district or department.'] },
  trends: { title: 'Trend Analysis', eyebrow: 'ANALYTICS · TIME SERIES', description: 'Track monthly and yearly movement with anomaly-aware trend signals.', primaryMetric: '31', primaryLabel: 'Schemes monitored', accent: 'purple', columns: ['Period', 'Enrollments', 'Active', 'Coverage'], rows: [['Q1 FY25-26', '18.4 L', '16.8 L', '69.8%'], ['Q2 FY25-26', '19.1 L', '17.6 L', '70.6%'], ['Q3 FY25-26', '20.8 L', '19.3 L', '71.2%'], ['Q4 FY25-26', '21.4 L', '20.1 L', '71.7%']], bars: [{ label: 'Q1', value: 68, tone: 'purple' }, { label: 'Q2', value: 72, tone: 'purple' }, { label: 'Q3', value: 83, tone: 'blue' }, { label: 'Q4', value: 91, tone: 'green' }], notes: ['Month-over-month analysis is available when the source system provides monthly snapshots.', 'Sudden spikes and drops should be validated against source ingestion logs.', 'Historical snapshots are retained for year-over-year comparison.'] },
  geography: { title: 'District & Block Analytics', eyebrow: 'GEOGRAPHY · PERFORMANCE', description: 'Rank districts and drill into blocks by coverage, growth and welfare gaps.', primaryMetric: '19', primaryLabel: 'Districts covered', accent: 'blue', columns: ['Rank', 'District / block', 'Citizens', 'Coverage', 'Growth'], rows: [['1', 'Kolkata', '4.9 L', '98.2%', '+12.1%'], ['2', 'Nadia', '8.4 L', '96.7%', '+9.8%'], ['3', 'Hooghly', '7.6 L', '94.8%', '+7.4%'], ['18', 'Malda', '6.5 L', '74.5%', '-3.4%'], ['19', 'Purulia', '4.3 L', '71.2%', '-5.8%']], bars: [{ label: 'Kolkata', value: 98, tone: 'blue' }, { label: 'Nadia', value: 97, tone: 'green' }, { label: 'Hooghly', value: 95, tone: 'green' }, { label: 'Malda', value: 75, tone: 'amber' }, { label: 'Purulia', value: 71, tone: 'red' }], notes: ['District Officer accounts are restricted to their assigned geography by the API.', 'Click a district in the production table to open its block drill-down.', 'Map visualization can be added after the approved geographic boundary source is available.'] },
  schemes: { title: 'Scheme Performance', eyebrow: 'SCHEMES · ENROLLMENT & COVERAGE', description: 'Compare enrollment, active beneficiaries, growth and district distribution across schemes.', primaryMetric: '31', primaryLabel: 'Active schemes', accent: 'teal', columns: ['Scheme', 'Beneficiaries', 'Active', 'Growth', 'Status'], rows: [['PM-KISAN', '1.21 Cr', '1.16 Cr', '+9.8%', 'Growing'], ['NFSA', '1.84 Cr', '1.76 Cr', '+4.1%', 'Stable'], ['MGNREGA', '74.2 L', '68.1 L', '+11.4%', 'Growing'], ['NSAP', '32.7 L', '30.2 L', '-1.8%', 'Watch'], ['Swasthya Sathi', '2.06 Cr', '1.93 Cr', '+6.3%', 'Stable']], bars: [{ label: 'PM-KISAN', value: 88, tone: 'blue' }, { label: 'NFSA', value: 82, tone: 'green' }, { label: 'MGNREGA', value: 76, tone: 'purple' }, { label: 'NSAP', value: 68, tone: 'amber' }, { label: 'Health', value: 61, tone: 'teal' }], notes: ['Coverage is measured against the approved population denominator for the selected geography.', 'Eligibility is never inferred from a gap signal unless rules are present in the source data.', 'Scheme comparisons use the same financial-year and geography filters.'] },
  gaps: { title: 'Welfare Gap / Lack Analysis', eyebrow: 'GAP ANALYSIS · MEASURED SIGNALS', description: 'Find measured coverage gaps without making unsupported eligibility claims.', primaryMetric: '28.3%', primaryLabel: 'Citizens with no scheme', accent: 'red', columns: ['Severity', 'Signal', 'Area', 'Gap', 'Owner'], rows: [['CRITICAL', 'No scheme coverage', 'Purulia · Balarampur', '31.4%', 'District'], ['HIGH', 'Declining enrollment', 'Malda · Manikchak', '8.6%', 'District'], ['MEDIUM', 'Low scheme diversity', 'Bankura · 12 blocks', '17.2%', 'State'], ['LOW', 'Source freshness', '9 source feeds', '6.1%', 'Pipeline']], bars: [{ label: 'No scheme', value: 72, tone: 'red' }, { label: 'Low coverage', value: 56, tone: 'amber' }, { label: 'Declining', value: 34, tone: 'purple' }, { label: 'Freshness', value: 18, tone: 'blue' }], notes: ['Measured gap = observed absence or low coverage in the master and enrollment data.', 'Potential gap = analytical signal only; it must not be labelled eligibility.', 'Severity is assigned from configurable coverage and trend thresholds.'] },
  reports: { title: 'Reports & Exports', eyebrow: 'REPORTING · CONTROLLED OUTPUTS', description: 'Generate state, district, scheme, growth and gap reports with RBAC-controlled export.', primaryMetric: '7', primaryLabel: 'Report templates', accent: 'purple', columns: ['Report', 'Scope', 'Last generated', 'Owner', 'Action'], rows: [['State Performance', 'West Bengal', '18 Aug 2026 10:42', 'State Analytics', 'Preview'], ['District Performance', 'Nadia', '18 Aug 2026 09:18', 'District Office', 'Preview'], ['Scheme Performance', 'PM-KISAN', '17 Aug 2026 18:22', 'Agriculture', 'Preview'], ['Gap Analysis', 'Purulia', '17 Aug 2026 15:06', 'Welfare Cell', 'Preview']], bars: [{ label: 'PDF', value: 75, tone: 'red' }, { label: 'Excel', value: 58, tone: 'green' }, { label: 'CSV', value: 43, tone: 'blue' }], notes: ['Exports are logged with user, filters, row count and timestamp.', 'Sensitive fields are removed unless the user has the export permission.', 'Large reports should be generated asynchronously by the backend.'] },
  alerts: { title: 'Alerts & Exceptions', eyebrow: 'MONITORING · ACTION QUEUE', description: 'Prioritize critical data quality, coverage and pipeline exceptions.', primaryMetric: '24', primaryLabel: 'Critical open alerts', accent: 'red', columns: ['Severity', 'Alert', 'Source', 'Created', 'Status'], rows: [['CRITICAL', 'Coverage below threshold', 'Gap engine', '18 Aug 2026', 'Open'], ['HIGH', 'Enrollment decline > 5%', 'Trend engine', '18 Aug 2026', 'Assigned'], ['MEDIUM', 'Source feed stale', 'Pipeline monitor', '17 Aug 2026', 'Open'], ['LOW', 'Manual grade review', 'Data audit', '16 Aug 2026', 'Queued']], bars: [{ label: 'Critical', value: 24, tone: 'red' }, { label: 'High', value: 41, tone: 'amber' }, { label: 'Medium', value: 68, tone: 'blue' }, { label: 'Low', value: 92, tone: 'green' }], notes: ['Alert ownership and acknowledgement are persisted in the audit service.', 'Critical alerts must be reviewed before publishing an official report.', 'Notification channels are configured per department and role.'] },
  administration: { title: 'Administration & Audit', eyebrow: 'ADMINISTRATION · ACCESS CONTROL', description: 'Manage users, roles, permissions, geography restrictions and immutable audit events.', primaryMetric: '42', primaryLabel: 'Active officers', accent: 'blue', columns: ['User', 'Role', 'Geography', 'Last login', 'Status'], rows: [['Ananya Sen', 'STATE_ADMIN', 'West Bengal', 'Today 10:34', 'Active'], ['Debashis Roy', 'DISTRICT_OFFICER', 'Nadia', 'Today 09:52', 'Active'], ['S. Mukherjee', 'ANALYST', 'State-wide', 'Yesterday 17:31', 'Active'], ['R. Das', 'VIEWER', 'Purulia', '15 Aug 2026', 'Locked']], bars: [{ label: 'State admin', value: 12, tone: 'blue' }, { label: 'District', value: 57, tone: 'green' }, { label: 'Analyst', value: 74, tone: 'purple' }, { label: 'Viewer', value: 91, tone: 'amber' }], notes: ['Role and geography restrictions must be enforced by backend authorization, not only the UI.', 'Sensitive citizen access is logged with purpose and record reference.', 'User and permission changes require an audit event.'] },
  assistant: { title: 'Analytics Assistant', eyebrow: 'CONTROLLED AI · API GROUNDED', description: 'Ask natural-language questions over approved analytics endpoints available to your role.', primaryMetric: '12', primaryLabel: 'Suggested questions', accent: 'teal', columns: ['Question', 'Data source', 'Answer type', 'Permission'], rows: [['Which district grew fastest?', 'District aggregate', 'Rank + trend', 'Allowed'], ['Where are welfare gaps largest?', 'Gap metrics', 'Severity list', 'Allowed'], ['How many have >3 schemes?', 'Citizen aggregate', 'Count', 'Allowed'], ['Show raw Aadhaar values', 'Sensitive citizen', 'Blocked', 'Denied']], bars: [{ label: 'Districts', value: 86, tone: 'blue' }, { label: 'Schemes', value: 73, tone: 'green' }, { label: 'Gaps', value: 65, tone: 'amber' }, { label: 'Citizen counts', value: 51, tone: 'teal' }], notes: ['The assistant calls a controlled analytics layer and never receives direct database access.', 'Every answer is filtered by the authenticated user’s role and geography.', 'Answers should expose source metric, period and filters used.'] },
};

configs['workbench'] = { ...configs['schemes'], title: 'Scheme Match Workbench', eyebrow: 'MATCHING · REVIEW QUEUE', description: 'Review exact, partial and mismatched records across every connected scheme.' };
configs['fuzzy'] = { ...configs['trends'], title: 'Fuzzy Match Lab & Engine', eyebrow: 'MATCHING · CONFIDENCE TUNING', description: 'Inspect candidate pairs, confidence thresholds and correction outcomes.' };
configs['audit'] = { ...configs['administration'], title: 'Data Grade Audit', eyebrow: 'DATA QUALITY · SOURCE LINEAGE', description: 'Trace source quality, grade exceptions and freshness before publishing metrics.' };

@Component({
  selector: 'app-operational-workspace',
  standalone: true,
  imports: [CommonModule, GlobalFiltersComponent, PageHeadingComponent, StateOverviewComponent, ModalComponent],
  templateUrl: './operational-workspace.html',
  styleUrl: './operational-workspace.css',
})
export class OperationalWorkspacePage {
  private readonly route = inject(ActivatedRoute);
  private readonly filterState = inject(FilterStateService);
  readonly displayBars = signal<{ label: string; value: number; tone: string }[]>([]);

   readonly pageSize = signal(5);
  readonly currentPage = signal(1);

  // constructor() {
    
  //   effect(() => {
  //     this.workspaceKey();
  //     this.selectedScheme();
  //     this.expandedScheme.set(null);
  //     this.statusFilter.set(null);
  //     this.sortState.set(null);
  //   });
  // }

  

  private readonly barLabelColumnIndex: Record<string, number> = {
  geography: 1, // ['Rank', 'District / block', ...]
  schemes: 0,   // ['Scheme', 'Beneficiaries', ...]
};

readonly paginatedBars = computed<{ label: string; value: number; tone: string }[]>(() => {
  const key = this.workspaceKey();
  const allBars = this.config().bars;
  const labelColumn = this.barLabelColumnIndex[key];

  // Tabs with no defined mapping keep showing the full bar set unfiltered.
  if (labelColumn === undefined) return allBars;

  const visibleLabels = new Set(this.paginatedRows().map((row) => row[labelColumn]));
  return allBars.filter((bar) => visibleLabels.has(bar.label));
});

 constructor() {
  // Collapse any expanded scheme drill-down and clear the table's local
  // sort/filter state whenever the workspace tab changes or the global
  // scheme filter changes underneath it.
  effect(() => {
    this.workspaceKey();
    this.selectedScheme();
    this.expandedScheme.set(null);
    this.statusFilter.set(null);
    this.sortState.set(null);
  }, { allowSignalWrites: true });

  // Reset to page 1 any time the underlying row set changes shape.
  effect(() => {
    this.config();
    this.sortState();
    this.currentPage.set(1);
  }, { allowSignalWrites: true });

  // Animate the Distribution bars to match whichever rows are currently
  // visible on the active page — fires on tab switch, filter, sort,
  // AND pagination since paginatedBars() depends on all of them.
  effect(() => {
    const bars = this.paginatedBars();
    this.displayBars.set(bars.map((bar) => ({ ...bar, value: 0 })));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.displayBars.set(bars);
      });
    });
  }, { allowSignalWrites: true });
}

 readonly totalPages = computed(() => {
    const total = this.sortedRows().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  readonly paginatedRows = computed<string[][]>(() => {
    const rows = this.sortedRows();
    const start = (this.currentPage() - 1) * this.pageSize();
    return rows.slice(start, start + this.pageSize());
  });

  readonly pageRangeLabel = computed<string>(() => {
    const total = this.sortedRows().length;
    if (total === 0) return 'No results';
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(start + this.pageSize() - 1, total);
    return `${start}–${end} of ${total}`;
  });

  goToPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }


  

  // Growth has no home in DistrictAnalytics yet, so it stays a static
  // lookup keyed by district name until a real growth metric exists.
  private readonly geographyGrowthByDistrict: Record<string, string> = {
    Kolkata: '+12.1%',
    Nadia: '+9.8%',
    Hooghly: '+7.4%',
    Malda: '-3.4%',
    Purulia: '-5.8%',
  };
    // Splits a "Label · Value" cell into its two halves so the value can be
  // colored differently from the label in the template.
  splitQualityCell(cell: string): { label: string; value: string } {
    const parts = cell.split(' · ');
    return { label: parts[0] ?? cell, value: parts[1] ?? '' };
  }

  readonly workspaceKey = computed(() => this.route.snapshot.data['workspace'] ?? 'analytics');
  private readonly SCHEME_QUALITY_COLUMNS = ['Gender', 'Caste', 'Ration Type', 'Data Grade'];
  // Live rows for the District & Block table, ranked by matchRate desc.
  readonly geographyRows = computed<string[][]>(() => {
    const districts = Object.values(DISTRICT_PROFILES) as DistrictAnalytics[];
    return [...districts]
      .sort((a, b) => b.matchRate - a.matchRate)
      .map((d, index) => [
        String(index + 1),
        d.name,
        this.formatCount(d.totalCitizens),
        `${d.matchRate.toFixed(1)}%`,
        this.geographyGrowthByDistrict[d.name] ?? 'N/A',
      ]);
  });

  readonly geographyBars = computed<{ label: string; value: number; tone: string }[]>(() => {
    const districts = Object.values(DISTRICT_PROFILES) as DistrictAnalytics[];
    return [...districts]
      .sort((a, b) => b.matchRate - a.matchRate)
      .map((d, index) => ({
        label: d.name,
        value: Math.round(d.matchRate),
        // Leader gets a highlight color; everyone else follows their
        // measured status so the bar color means something, not just rank.
        tone: index === 0 ? 'blue' : this.toneToColor(d.tone),
      }));
  });

  private toneToColor(tone: DistrictAnalytics['tone']): string {
    switch (tone) {
      case 'good':
        return 'green';
      case 'watch':
        return 'amber';
      case 'risk':
        return 'red';
      default:
        return 'blue';
    }
  }

  readonly config = computed<WorkspaceConfig>(() => {
    const base = configs[this.workspaceKey()] ?? configs['analytics'];

    if (this.workspaceKey() === 'geography') {
      const merged: WorkspaceConfig = {
        ...base,
        rows: this.geographyRows(),
        bars: this.geographyBars(),
      };
      return merged;
    }

    if (this.workspaceKey() === 'schemes') {
      
      const merged: WorkspaceConfig = {
        ...base,

        columns: [...base.columns, ...this.SCHEME_QUALITY_COLUMNS],
        
        rows: this.schemesRows(),
        bars: this.schemesBars(),
      };
      return merged;
    }

    return base;
  });

  readonly selectedDistrictName = computed<string | null>(() => {
    const district = this.filterState.filters().district;
    return district && district !== 'All districts' ? district : null;
  });

  readonly showStateOverview = computed(() => this.workspaceKey() === 'geography');

  readonly districtsIndexedCount = computed<number>(() => Object.keys(DISTRICT_PROFILES).length);

  readonly schemesMonitoredCount = computed<number>(() => {
    const districts = Object.values(DISTRICT_PROFILES) as DistrictAnalytics[];
    const schemeNames = new Set<string>();
    for (const d of districts) {
      for (const scheme of d.topSchemes ?? []) {
        schemeNames.add(scheme.label);
      }
    }
    return schemeNames.size;
  });

  readonly selectedScheme = computed<string | null>(() => {
    const scheme = this.filterState.filters().scheme;
    return scheme && scheme !== 'All schemes' ? scheme : null;
  });

  // --- Status quick-filter (schemes workspace only) ---
  // Status column is index 4 in the 'schemes' config: ['Scheme','Beneficiaries','Active','Growth','Status']
  private readonly SCHEME_STATUS_COLUMN_INDEX = 4;

  readonly statusFilter = signal<string | null>(null); // null = "All"

  readonly schemeStatuses = computed<string[]>(() => {
    const base = configs['schemes'].rows;
    return Array.from(new Set(base.map((row) => row[this.SCHEME_STATUS_COLUMN_INDEX])));
  });

  setStatusFilter(status: string | null): void {
    this.statusFilter.set(status);
  }

  // readonly schemesRows = computed<string[][]>(() => {
  //   const base = configs['schemes'].rows;
  //   const scheme = this.selectedScheme();
  //   const status = this.statusFilter();

  //   let rows = scheme ? base.filter((row) => row[0] === scheme) : base;
  //   if (status) {
  //     rows = rows.filter((row) => row[this.SCHEME_STATUS_COLUMN_INDEX] === status);
  //   }
  //   return rows;
  // });

    readonly schemesRows = computed<string[][]>(() => {
    const base = configs['schemes'].rows;
    const scheme = this.selectedScheme();
    const status = this.statusFilter();

    let rows = scheme ? base.filter((row) => row[0] === scheme) : base;
    if (status) {
      rows = rows.filter((row) => row[this.SCHEME_STATUS_COLUMN_INDEX] === status);
    }
    return rows.map((row) => [...row, ...this.schemeQualityCells(row[0])]);
  });

  readonly schemesBars = computed<{ label: string; value: number; tone: string }[]>(() => {
    const base = configs['schemes'].bars;
    const scheme = this.selectedScheme();
    return scheme ? base.filter((bar) => bar.label === scheme) : base;
  });

    // NEW — pulls per-scheme data-quality figures from SCHEME_AGGREGATES and
  // formats them as extra table cells, in the same order as SCHEME_QUALITY_COLUMNS.
   // Shows the majority value in each breakdown, since a table cell can only
  // hold one value while each breakdown array has several. Full breakdowns
  // remain visible in the scheme detail modal via schemeAggregate().
  private schemeQualityCells(schemeName: string): string[] {
    const agg = SCHEME_AGGREGATES[schemeName];
    if (!agg) {
      return ['N/A', 'N/A', 'N/A', 'N/A'];
    }
    const total = agg.totalBeneficiaries;

    const topGender = [...agg.genderBreakdown].sort((a, b) => b.count - a.count)[0];
    const topCaste = [...agg.casteBreakdown].sort((a, b) => b.count - a.count)[0];
    const topRation = [...agg.rationCardTypeBreakdown].sort((a, b) => b.count - a.count)[0];
    const topGrade = [...agg.dataGradeBreakdown].sort((a, b) => b.count - a.count)[0];

    return [
      `${topGender.gender ?? 'Unspecified'} · ${this.pct(topGender.count, total)}%`,
      `${topCaste.caste ?? 'Unspecified'} · ${this.pct(topCaste.count, total)}%`,
      `${topRation.code ?? 'Unspecified'} · ${topRation.count.toLocaleString('en-IN')}`,
      `${topGrade.grade != null ? 'Grade ' + topGrade.grade : 'N/A'} · ${topGrade.count.toLocaleString('en-IN')}`,
    ];
  }

  // --- Sortable columns (applies to whichever table is currently shown) ---
  readonly sortState = signal<SortState | null>(null);

  toggleSort(columnIndex: number): void {
    this.sortState.update((current) => {
      if (!current || current.columnIndex !== columnIndex) {
        return { columnIndex, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { columnIndex, direction: 'desc' };
      }
      return null; // third click clears sort, back to original order
    });
  }

  // Parses a cell like "1.21 Cr", "68.1 L", "+9.8%", "-1.8%" into a number
  // for correct numeric ordering; falls back to case-insensitive string
  // comparison for plain text cells (scheme names, status labels, etc.).
  private parseCellValue(cell: string): number | string {
    const cleaned = (cell ?? '').trim();
    const crMatch = cleaned.match(/^([+-]?\d+(\.\d+)?)\s*Cr$/i);
    if (crMatch) return parseFloat(crMatch[1]) * 1_00_00_000;

    const lMatch = cleaned.match(/^([+-]?\d+(\.\d+)?)\s*L$/i);
    if (lMatch) return parseFloat(lMatch[1]) * 1_00_000;

    const pctMatch = cleaned.match(/^([+-]?\d+(\.\d+)?)\s*%$/);
    if (pctMatch) return parseFloat(pctMatch[1]);

    const plainNum = cleaned.replace(/,/g, '');
    if (plainNum !== '' && !isNaN(Number(plainNum))) return Number(plainNum);

    return cleaned.toLowerCase();
  }

  readonly sortedRows = computed<string[][]>(() => {
    const rows = this.config().rows;
    const sort = this.sortState();
    if (!sort) return rows;

    const { columnIndex, direction } = sort;
    return [...rows].sort((a, b) => {
      const va = this.parseCellValue(a[columnIndex]);
      const vb = this.parseCellValue(b[columnIndex]);

      if (typeof va === 'number' && typeof vb === 'number') {
        return direction === 'asc' ? va - vb : vb - va;
      }
      return direction === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  });

  // --- Scheme drill-down state (modal-based) ---
  // Which scheme row is currently expanded / driving the modal.
  readonly expandedScheme = signal<string | null>(null);

  toggleSchemeRow(schemeName: string): void {
    if (this.workspaceKey() !== 'schemes') return;
    this.expandedScheme.update((current) => (current === schemeName ? null : schemeName));
  }

  closeSchemeDetail(): void {
    this.expandedScheme.set(null);
  }

  // Hardcoded for now — shaped exactly like the real srs_master aggregation
  // response, so swapping this for a live SchemeAggregateService call later
  // only requires replacing this computed's body.
  readonly schemeAggregate = computed<SchemeMasterAggregate | null>(() => {
    const key = this.expandedScheme();
    return key ? SCHEME_AGGREGATES[key] ?? null : null;
  });

  pct(part: number, total: number): number {
    if (!total) return 0;
    return Math.round((part / total) * 100);
  }

  private formatCount(value: number): string {
    if (!value) return '0';
    if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
    if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(1)} L`;
    return value.toLocaleString('en-IN');
  }

  // --- Export view ---
readonly showExportMenu = signal(false);

toggleExportMenu(): void {
  this.showExportMenu.update((v) => !v);
}

closeExportMenu(): void {
  this.showExportMenu.set(false);
}

private slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

private downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Exports exactly what's on screen right now: current workspace tab,
// current status filter (schemes), and current column sort.
exportCsv(): void {
  const page = this.config();
  const rows = this.sortedRows();

  const escapeCell = (cell: string) => `"${(cell ?? '').replace(/"/g, '""')}"`;
  const header = page.columns.map(escapeCell).join(',');
  const body = rows.map((row) => row.map(escapeCell).join(',')).join('\n');
  const csv = `${header}\n${body}`;

  this.downloadBlob(csv, `${this.slugify(page.title)}.csv`, 'text/csv;charset=utf-8;');
  this.closeExportMenu();
}

exportJson(): void {
  const page = this.config();
  const rows = this.sortedRows();
  const data = rows.map((row) =>
    Object.fromEntries(page.columns.map((col, i) => [col, row[i] ?? '']))
  );

  this.downloadBlob(JSON.stringify(data, null, 2), `${this.slugify(page.title)}.json`, 'application/json');
  this.closeExportMenu();
}

printView(): void {
  this.closeExportMenu();
  // Let the menu close and repaint before the print dialog opens.
  setTimeout(() => window.print(), 50);
}
}
