import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/api/api.service';
import { DashboardFilter } from '../../../shared/models/filter.model';
import { GapAnalysisSnapshot, GapRecord } from '../models/gap-analysis.model';

const records: GapRecord[] = [
  { uid: '776802774695', district: 'Purulia', block: 'Balarampur', department: 'Agriculture', scheme: 'SCH_PMKISAN', masterName: 'Sita Patra', schemeName: 'Sita Patra', trigger: 'DOB Variance', confidence: 95, masterDob: '1991-10-23', schemeDob: '1989-10-23', gender: 'Female', caste: 'GENERAL' },
  { uid: '776802774695', district: 'Nadia', block: 'Krishnanagar I', department: 'Rural Development', scheme: 'SCH_NSAP', masterName: 'Sita Patra', schemeName: 'Sita Patra', trigger: 'DOB Variance', confidence: 95, masterDob: '1991-10-23', schemeDob: '1989-10-23', gender: 'Female', caste: 'GENERAL' },
  { uid: '702044098831', district: 'Malda', block: 'Manikchak', department: 'Health & Family Welfare', scheme: 'SCH_HEALTH', masterName: 'Kavita Raut', schemeName: 'Kavita Raut', trigger: 'DOB Variance', confidence: 95, masterDob: '1988-02-16', schemeDob: '1985-02-16', gender: 'Female', caste: 'GENERAL' },
  { uid: '745274325994', district: 'Hooghly', block: 'Chinsurah-Magrah', department: 'Agriculture', scheme: 'SCH_NFSA', masterName: 'Kavita Panda', schemeName: 'Kavita Panda', trigger: 'DOB Variance', confidence: 95, masterDob: '1982-06-11', schemeDob: '1979-06-11', gender: 'Female', caste: 'OBC' },
  { uid: '701199914272', district: 'Kolkata', block: 'Salt Lake', department: 'Women & Child Development', scheme: 'SCH_HEALTH', masterName: 'Minati Pradhan', schemeName: 'Minati Pradhan', trigger: 'DOB Variance', confidence: 95, masterDob: '1978-04-19', schemeDob: '1975-04-19', gender: 'Female', caste: 'GENERAL' },
  { uid: '701199914272', district: 'Kolkata', block: 'Salt Lake', department: 'Rural Development', scheme: 'SCH_MGNREGA', masterName: 'Minati Pradhan', schemeName: 'Minati Pradhan', trigger: 'DOB Variance', confidence: 95, masterDob: '1978-04-19', schemeDob: '1975-04-19', gender: 'Female', caste: 'GENERAL' },
  { uid: '713432488826', district: 'Purulia', block: 'Balarampur', department: 'Rural Development', scheme: 'SCH_NFSA', masterName: 'Manoj Swain', schemeName: 'Manoj Swain', trigger: 'DOB Variance', confidence: 95, masterDob: '1974-08-10', schemeDob: '1971-08-10', gender: 'Male', caste: 'GENERAL' },
  { uid: '713432488826', district: 'Purulia', block: 'Balarampur', department: 'Agriculture', scheme: 'SCH_PMKISAN', masterName: 'Manoj Swain', schemeName: 'Manoj Swain', trigger: 'Gender Mismatch, DOB Variance', confidence: 65, masterDob: '1974-08-10', schemeDob: '1971-08-10', gender: 'Male', caste: 'GENERAL' },
  { uid: '733924912865', district: 'Nadia', block: 'Krishnanagar I', department: 'Health & Family Welfare', scheme: 'SCH_HEALTH', masterName: 'Deepak Mohanty', schemeName: 'Deepak Mohanty', trigger: 'DOB Variance', confidence: 95, masterDob: '1980-01-14', schemeDob: '1977-01-14', gender: 'Male', caste: 'GENERAL' },
  { uid: '701583692270', district: 'Malda', block: 'Manikchak', department: 'Health & Family Welfare', scheme: 'SCH_HEALTH', masterName: 'Amit Mohanty', schemeName: 'Amit Mohanty', trigger: 'Gender Mismatch', confidence: 90, masterDob: '1986-05-20', schemeDob: '1986-05-20', gender: 'Male', caste: 'OBC' },
];

@Injectable({ providedIn: 'root' })
export class GapAnalysisService {
  private readonly api = inject(ApiService);

  getOverview(filters: DashboardFilter): Observable<GapAnalysisSnapshot> {
    if (!environment.useMockApi) return this.api.get<GapAnalysisSnapshot>('/gap-analysis/overview', { financialYear: filters.financialYear, district: filters.district, block: filters.block, scheme: filters.scheme, department: filters.department });
    return of(this.buildSnapshot(this.filterRecords(filters), filters)).pipe(delay(220));
  }

  refresh(): Observable<void> {
    return environment.useMockApi ? of(void 0).pipe(delay(350)) : this.api.post<void>('/gap-analysis/refresh', {});
  }

  private filterRecords(filters: DashboardFilter): GapRecord[] {
    return records.filter((record) =>
      (filters.district === 'All districts' || record.district === filters.district) &&
      (filters.block === 'All blocks' || record.block === filters.block) &&
      (filters.scheme === 'All schemes' || record.scheme === ({ 'PM-KISAN': 'SCH_PMKISAN', NFSA: 'SCH_NFSA', MGNREGA: 'SCH_MGNREGA', NSAP: 'SCH_NSAP', 'Swasthya Sathi': 'SCH_HEALTH' } as Record<string, string>)[filters.scheme]) &&
      (filters.department === 'All departments' || record.department === filters.department),
    );
  }

  private buildSnapshot(filtered: GapRecord[], filters?: DashboardFilter): GapAnalysisSnapshot {
    const averageConfidence = filtered.length ? filtered.reduce((total, row) => total + row.confidence, 0) / filtered.length : 0;
    const typeCount = (type: string) => filtered.filter((row) => row.trigger.includes(type)).length;
    const ranges = [{ label: '0-40%', min: 0, max: 40 }, { label: '41-60%', min: 41, max: 60 }, { label: '61-80%', min: 61, max: 80 }, { label: '81-95%', min: 81, max: 95 }, { label: '96-100%', min: 96, max: 100 }];
    const schemes = [...new Set(filtered.map((row) => row.scheme))];
    const geographicRows = filters?.district && filters.district !== 'All districts' ? [...new Set(filtered.map((row) => row.block))].map((name) => ({ name, totalGaps: filtered.filter((row) => row.block === name).length })) : [...new Set(filtered.map((row) => row.district))].map((name) => ({ name, totalGaps: filtered.filter((row) => row.district === name).length }));
    return {
      summary: { totalDiscrepancies: filtered.length, highPriorityGaps: filtered.filter((row) => row.confidence < 70).length, averageConfidence: Number(averageConfidence.toFixed(1)), affectedMembers: new Set(filtered.map((row) => row.uid)).size },
      tabCounts: { all: filtered.length, genderMismatch: typeCount('Gender'), dobVariance: typeCount('DOB'), lowConfidence: filtered.filter((row) => row.confidence < 60).length },
      discrepancyFrequency: [{ type: 'DOB Variance', count: typeCount('DOB') }, { type: 'Gender Mismatch', count: typeCount('Gender') }, { type: 'Low Confidence', count: filtered.filter((row) => row.confidence < 60).length }].filter((item) => item.count > 0),
      schemeDistribution: schemes.map((schemeName) => { const schemeRows = filtered.filter((row) => row.scheme === schemeName); return { schemeName, critical: schemeRows.filter((row) => row.confidence < 70).length, moderate: schemeRows.filter((row) => row.confidence >= 70 && row.confidence < 85).length, low: schemeRows.filter((row) => row.confidence >= 85).length }; }),
      confidenceDistribution: ranges.map((range) => ({ range: range.label, count: filtered.filter((row) => row.confidence >= range.min && row.confidence <= range.max).length })),
      geographicDistribution: geographicRows,
      records: filtered,
    };
  }
}
