export type InsightSeverity = 'success' | 'warning' | 'info';

export interface DashboardInsight {
  title: string;
  text: string;
  severity: InsightSeverity;
}

export interface DistrictPerformanceRow {
  district: string;
  beneficiaries: string;
  coverage: number;
  growth: number;
  rank: number;
}
