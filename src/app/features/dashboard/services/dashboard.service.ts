import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardSummary } from '../../../core/models/api.models';

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
  getSummary(): Observable<DashboardSummary> {
    return of({ totalCitizens: 50384210, totalBeneficiaries: 36128452, activeBeneficiaries: 33851004, schemeEnrollments: 74285019, coveragePercentage: 71.7, growthRate: 8.4 });
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
