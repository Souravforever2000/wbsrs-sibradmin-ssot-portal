export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface SortRequest {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CitizenRecord {
  uid: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  district: string;
  block: string;
  maskedAadhaar: string;
  schemeCount: number;
  schemeIds: string[];   // add this
  dataGrade: number;     // add this
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

export interface DashboardSummary {
  totalUniqueMembers: number;
  schemeMatchesChecked: number;
  highMatchRate: number;
  criticalDiscrepancies: number;
}

export interface GradeDistributionItem {
  grade: string;
  value: number;
  color: string;
  label: string;
}

export interface StatusBreakdownItem {
  scheme: string;
  exact: number;
  partial: number;
  mismatch: number;
  color: string;
}

export interface DiscrepancyItem {
  label: string;
  value: number;
  color: string;
}

export interface ConfidenceBucket {
  label: string;
  value: number;
  color: string;
}

export interface GradeMatrixItem {
  grade: string;
  description: string;
  members: number;
  avgNameMatch: number;
  dobVariance: number;
  aadhaarVault: number;
  recommendedAudit: string;
}

export interface DashboardDataset {
  summary: DashboardSummary;
  gradeDistribution: GradeDistributionItem[];
  statusBreakdown: StatusBreakdownItem[];
  discrepancyFrequency: DiscrepancyItem[];
  confidenceSpectrum: ConfidenceBucket[];
  gradeMatrix: GradeMatrixItem[];
}

