export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalCitizens: number;
  totalBeneficiaries: number;
  activeBeneficiaries: number;
  schemeEnrollments: number;
  coveragePercentage: number;
  growthRate: number;
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
  status: 'Active' | 'Inactive' | 'Pending';
  lastUpdated: string;
}
