import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import type { DashboardInsight, DistrictPerformanceRow } from '../models/dashboard.models';
import { DashboardDataset, DashboardSummary, GradeMatrixItem, GradeDistributionItem, StatusBreakdownItem, DiscrepancyItem, ConfidenceBucket } from '../../../core/models/api.models';
import { DISTRICT_PROFILES } from '../data/district-profiles';
import type { DistrictAnalytics } from '../models/district.models';
import { CitizenService } from '../../citizens/services/citizen.service'; // adjust to actual path

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly citizenService = inject(CitizenService);

  // Growth has no home in DistrictAnalytics yet, so it stays a static
  // lookup keyed by district name until a real growth metric exists.
  // NOTE: duplicated in operational-workspace.ts — consider extracting
  // to one shared constant so the two copies can't drift apart.
  private readonly districtGrowthByName: Record<string, number> = {
    Kolkata: 12.1,
    Nadia: 9.8,
    Hooghly: 7.4,
    Malda: -3.4,
    Purulia: -5.8,
  };

  private readonly gradeMeta: Record<number, { color: string; label: string }> = {
    1: { color: '#1f78b4', label: 'Direct Aadhaar Vault' },
    2: { color: '#2db7b0', label: 'State API Verified' },
    3: { color: '#f39c12', label: 'Dept Database' },
    4: { color: '#f05a28', label: 'Census & Survey' },
    5: { color: '#8e44ad', label: 'Manual Entry' },
  };

  getDashboard(): Observable<DashboardDataset> {
    return this.citizenService.getGradeCounts().pipe(
      map((gradeCounts) => {
        const gradeDistribution: GradeDistributionItem[] = gradeCounts.map(({ grade, count }) => {
          const meta = this.gradeMeta[grade];
          return { grade: `Grade ${grade}`, value: count, color: meta.color, label: meta.label };
        });

        const totalUniqueMembers = gradeDistribution.reduce((sum, g) => sum + g.value, 0);

        const summary: DashboardSummary = {
          totalUniqueMembers,
          schemeMatchesChecked: 152,
          highMatchRate: 90.1,
          criticalDiscrepancies: 20,
        };

        // No matching-engine dataset exists yet for these — kept static
        // until a real source is available.
        const statusBreakdown: StatusBreakdownItem[] = [
          { scheme: 'PM-KISAN', exact: 40, partial: 18, mismatch: 12, color: '#2db7b0' },
          { scheme: 'NFSA', exact: 35, partial: 16, mismatch: 10, color: '#3b82f6' },
          { scheme: 'MGNREGA', exact: 30, partial: 20, mismatch: 11, color: '#f59e0b' },
          { scheme: 'NSAP', exact: 27, partial: 19, mismatch: 8, color: '#ef4444' },
          { scheme: 'HEALTH', exact: 33, partial: 15, mismatch: 9, color: '#8b5cf6' },
        ];

        const discrepancyFrequency: DiscrepancyItem[] = [
          { label: 'Name Variance', value: 45, color: '#8b5cf6' },
          { label: 'DOB Variance', value: 38, color: '#3b82f6' },
          { label: 'Gender Mismatch', value: 24, color: '#ef4444' },
          { label: 'Caste Conflict', value: 19, color: '#f59e0b' },
        ];

        const confidenceSpectrum: ConfidenceBucket[] = [
          { label: '0-40%', value: 6, color: '#ef4444' },
          { label: '41-80%', value: 18, color: '#f59e0b' },
          { label: '81-95%', value: 36, color: '#0ea5e9' },
          { label: '96-100%', value: 42, color: '#10b981' },
        ];

        const gradeMatrix: GradeMatrixItem[] = [
          { grade: 'Grade 1', description: 'Direct demographic match with UIDAI vault', members: gradeDistribution[0].value, avgNameMatch: 99.9, dobVariance: 30.4, aadhaarVault: 100, recommendedAudit: 'Auto-approved / Zero Audit' },
          { grade: 'Grade 2', description: 'Validated against e-District / State Registry Database APIs.', members: gradeDistribution[1].value, avgNameMatch: 96.2, dobVariance: 10.9, aadhaarVault: 100, recommendedAudit: 'Random 5% Sampling' },
          { grade: 'Grade 3', description: 'Ingested from departmental database records', members: gradeDistribution[2].value, avgNameMatch: 97.2, dobVariance: 30.3, aadhaarVault: 78, recommendedAudit: '15% Sample Check' },
          { grade: 'Grade 4', description: 'Sourced from historical socio-economic survey census.', members: gradeDistribution[3].value, avgNameMatch: 94.4, dobVariance: 21.1, aadhaarVault: 35, recommendedAudit: '50% Verification' },
          { grade: 'Grade 5', description: 'Captured via manual offline GP / Block registration forms.', members: gradeDistribution[4].value, avgNameMatch: 97.8, dobVariance: 25.8, aadhaarVault: 35, recommendedAudit: '100% Mandatory Field Audit' },
        ];

        return { summary, gradeDistribution, statusBreakdown, discrepancyFrequency, confidenceSpectrum, gradeMatrix };
      })
    );
  }

  getSummary(): Observable<DashboardSummary> {
    return this.getDashboard().pipe(map((dataset) => dataset.summary));
  }

  getInsights(): Observable<DashboardInsight[]> {
    const districts = Object.values(DISTRICT_PROFILES) as DistrictAnalytics[];

    const topGrowthDistrict = [...districts]
      .filter((d) => this.districtGrowthByName[d.name] !== undefined)
      .sort((a, b) => this.districtGrowthByName[b.name] - this.districtGrowthByName[a.name])[0];

    const lowestCoverageDistrict = [...districts].sort((a, b) => a.matchRate - b.matchRate)[0];

    const aboveThresholdPct = districts.length ? (districts.filter((d) => d.matchRate >= 85).length / districts.length) * 100 : 0;

    const insights: DashboardInsight[] = [];

    if (topGrowthDistrict) {
      const growth = this.districtGrowthByName[topGrowthDistrict.name];
      insights.push({
        title: 'Top growth district',
        text: `${topGrowthDistrict.name} recorded ${growth.toFixed(1)}% beneficiary growth versus 2024-25.`,
        severity: 'success',
      });
    }

    if (lowestCoverageDistrict) {
      insights.push({
        title: 'Coverage gap',
        text: `${lowestCoverageDistrict.name} has the lowest measured scheme coverage at ${lowestCoverageDistrict.matchRate.toFixed(1)}%.`,
        severity: 'warning',
      });
    }

    insights.push({
      title: 'Match quality',
      text: `${aboveThresholdPct.toFixed(1)}% of records are above the 85% confidence threshold.`,
      severity: 'info',
    });

    return of(insights);
  }

  getDistrictPerformance(): Observable<DistrictPerformanceRow[]> {
    const districts = Object.values(DISTRICT_PROFILES) as DistrictAnalytics[];
    const ranked = [...districts].sort((a, b) => b.matchRate - a.matchRate);

    // Mirror the "leaders + laggards" view (top 3, bottom 2) instead of
    // listing every district, to match the previous static table.
    const selected = ranked.length > 5 ? [...ranked.slice(0, 3), ...ranked.slice(-2)] : ranked;

    const rows: DistrictPerformanceRow[] = selected.map((d) => ({
      rank: ranked.indexOf(d) + 1,
      district: d.name,
      beneficiaries: this.formatCount(d.totalCitizens),
      coverage: Number(d.matchRate.toFixed(1)),
      growth: this.districtGrowthByName[d.name] ?? 0,
    }));

    return of(rows);
  }

  private formatCount(value: number): string {
    if (!value) return '0';
    if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
    if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(1)} L`;
    return value.toLocaleString('en-IN');
  }
}