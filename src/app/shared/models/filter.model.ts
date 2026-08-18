export interface DashboardFilter {
  financialYear: string;
  district: string;
  block: string;
  scheme: string;
  department: string;
  gender: string;
  status: string;
}

export const defaultDashboardFilter: DashboardFilter = {
  financialYear: '2025-26',
  district: 'All districts',
  block: 'All blocks',
  scheme: 'All schemes',
  department: 'All departments',
  gender: 'All genders',
  status: 'All statuses',
};
