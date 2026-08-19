import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DashboardDataset, DashboardSummary, GradeMatrixItem, GradeDistributionItem, StatusBreakdownItem, DiscrepancyItem, ConfidenceBucket } from '../../../core/models/api.models';

export interface Insight {
  title: string;
  text: string;
  severity: 'success' | 'warning' | 'info';
}

export interface PerformanceRow {
  district: string;
  beneficiaries: string;
  coverage: number;
  growth: number;
  rank: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getDashboard(): Observable<DashboardDataset> {
    const summary: DashboardSummary = {
      totalUniqueMembers: 50,
      schemeMatchesChecked: 152,
      highMatchRate: 90.1,
      criticalDiscrepancies: 20,
    };

    const gradeDistribution: GradeDistributionItem[] = [
      { grade: 'Grade 1', value: 8, color: '#1f78b4', label: 'Direct Aadhaar Vault' },
      { grade: 'Grade 2', value: 14, color: '#2db7b0', label: 'State API Verified' },
      { grade: 'Grade 3', value: 11, color: '#f39c12', label: 'Dept Database' },
      { grade: 'Grade 4', value: 7, color: '#f05a28', label: 'Census & Survey' },
      { grade: 'Grade 5', value: 10, color: '#8e44ad', label: 'Manual Entry' },
    ];

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
      { grade: 'Grade 1', description: 'Direct demographic match with UIDAI vault', members: 8, avgNameMatch: 99.9, dobVariance: 30.4, aadhaarVault: 100, recommendedAudit: 'Auto-approved / Zero Audit' },
      { grade: 'Grade 2', description: 'Validated against e-District / State Registry Database APIs.', members: 14, avgNameMatch: 96.2, dobVariance: 10.9, aadhaarVault: 100, recommendedAudit: 'Random 5% Sampling' },
      { grade: 'Grade 3', description: 'Ingested from departmental database records', members: 11, avgNameMatch: 97.2, dobVariance: 30.3, aadhaarVault: 78, recommendedAudit: '15% Sample Check' },
      { grade: 'Grade 4', description: 'Sourced from historical socio-economic survey census.', members: 7, avgNameMatch: 94.4, dobVariance: 21.1, aadhaarVault: 35, recommendedAudit: '50% Verification' },
      { grade: 'Grade 5', description: 'Captured via manual offline GP / Block registration forms.', members: 10, avgNameMatch: 97.8, dobVariance: 25.8, aadhaarVault: 35, recommendedAudit: '100% Mandatory Field Audit' },
    ];

    return of({ summary, gradeDistribution, statusBreakdown, discrepancyFrequency, confidenceSpectrum, gradeMatrix });
  }

  getSummary(): Observable<DashboardSummary> {
    return this.getDashboard().pipe(map((dataset) => dataset.summary));
  }

  getInsights(): Observable<Insight[]> {
    return of([
      { title: 'Top growth district', text: 'Kolkata recorded 12.1% beneficiary growth versus 2024-25.', severity: 'success' },
      { title: 'Coverage gap', text: 'Purulia has the lowest measured scheme coverage at 71.2%.', severity: 'warning' },
      { title: 'Match quality', text: '93.5% of records are above the 85% confidence threshold.', severity: 'info' },
    ]);
  }

  getDistrictPerformance(): Observable<PerformanceRow[]> {
    return of([
      { rank: 1, district: 'Kolkata', beneficiaries: '4.8L', coverage: 98.2, growth: 12.1 },
      { rank: 2, district: 'Nadia', beneficiaries: '8.1L', coverage: 96.7, growth: 9.8 },
      { rank: 3, district: 'Hooghly', beneficiaries: '7.3L', coverage: 94.8, growth: 7.4 },
      { rank: 18, district: 'Malda', beneficiaries: '6.2L', coverage: 74.5, growth: -3.4 },
      { rank: 19, district: 'Purulia', beneficiaries: '4.1L', coverage: 71.2, growth: -5.8 },
    ]);
  }
}
