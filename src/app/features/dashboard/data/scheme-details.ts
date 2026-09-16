export interface SchemeTrendPoint {
  period: string;
  active: string;
  growth: string;
}

export interface SchemeDistrictBreakdown {
  district: string;
  beneficiaries: string;
  active: string;
  coverage: number; // 0-100, drives the mini bar
  status: 'Growing' | 'Stable' | 'Watch';
}

export interface SchemeFundUtilization {
  allocated: string;
  disbursed: string;
  pending: string;
  utilizationPct: number; // 0-100
}

export interface SchemeDetail {
  key: string; // must match the scheme name used in configs['schemes'].rows[i][0]
  summary: string;
  trend: SchemeTrendPoint[];
  districtBreakdown: SchemeDistrictBreakdown[];
  fundUtilization: SchemeFundUtilization;
}

export const SCHEME_DETAILS: Record<string, SchemeDetail> = {
  'PM-KISAN': {
    key: 'PM-KISAN',
    summary: 'Direct income support to landholding farmer families, disbursed in three equal instalments per year.',
    trend: [
      { period: 'Q1 FY25-26', active: '1.08 Cr', growth: '+6.2%' },
      { period: 'Q2 FY25-26', active: '1.11 Cr', growth: '+7.4%' },
      { period: 'Q3 FY25-26', active: '1.14 Cr', growth: '+8.9%' },
      { period: 'Q4 FY25-26', active: '1.16 Cr', growth: '+9.8%' },
    ],
    districtBreakdown: [
      { district: 'Nadia', beneficiaries: '18.2 L', active: '17.6 L', coverage: 96, status: 'Growing' },
      { district: 'Hooghly', beneficiaries: '15.4 L', active: '14.6 L', coverage: 94, status: 'Growing' },
      { district: 'Kolkata', beneficiaries: '2.1 L', active: '1.9 L', coverage: 88, status: 'Stable' },
      { district: 'Malda', beneficiaries: '11.8 L', active: '10.1 L', coverage: 74, status: 'Watch' },
      { district: 'Purulia', beneficiaries: '9.6 L', active: '7.9 L', coverage: 71, status: 'Watch' },
    ],
    fundUtilization: { allocated: '₹4,820 Cr', disbursed: '₹4,390 Cr', pending: '₹430 Cr', utilizationPct: 91 },
  },
  NFSA: {
    key: 'NFSA',
    summary: 'Subsidized foodgrain entitlement for priority and Antyodaya households under the public distribution system.',
    trend: [
      { period: 'Q1 FY25-26', active: '1.69 Cr', growth: '+2.8%' },
      { period: 'Q2 FY25-26', active: '1.72 Cr', growth: '+3.2%' },
      { period: 'Q3 FY25-26', active: '1.74 Cr', growth: '+3.8%' },
      { period: 'Q4 FY25-26', active: '1.76 Cr', growth: '+4.1%' },
    ],
    districtBreakdown: [
      { district: 'Kolkata', beneficiaries: '9.1 L', active: '8.8 L', coverage: 97, status: 'Stable' },
      { district: 'Nadia', beneficiaries: '22.4 L', active: '21.6 L', coverage: 96, status: 'Stable' },
      { district: 'Hooghly', beneficiaries: '19.8 L', active: '18.9 L', coverage: 95, status: 'Stable' },
      { district: 'Malda', beneficiaries: '17.2 L', active: '15.4 L', coverage: 90, status: 'Watch' },
      { district: 'Purulia', beneficiaries: '10.9 L', active: '9.6 L', coverage: 88, status: 'Watch' },
    ],
    fundUtilization: { allocated: '₹6,110 Cr', disbursed: '₹5,940 Cr', pending: '₹170 Cr', utilizationPct: 97 },
  },
  MGNREGA: {
    key: 'MGNREGA',
    summary: 'Guaranteed rural wage employment scheme providing 100 days of work per household per year.',
    trend: [
      { period: 'Q1 FY25-26', active: '58.4 L', growth: '+7.1%' },
      { period: 'Q2 FY25-26', active: '61.9 L', growth: '+9.0%' },
      { period: 'Q3 FY25-26', active: '65.2 L', growth: '+10.6%' },
      { period: 'Q4 FY25-26', active: '68.1 L', growth: '+11.4%' },
    ],
    districtBreakdown: [
      { district: 'Purulia', beneficiaries: '11.2 L', active: '10.4 L', coverage: 93, status: 'Growing' },
      { district: 'Malda', beneficiaries: '13.6 L', active: '12.1 L', coverage: 89, status: 'Growing' },
      { district: 'Hooghly', beneficiaries: '9.8 L', active: '8.7 L', coverage: 89, status: 'Stable' },
      { district: 'Nadia', beneficiaries: '14.1 L', active: '12.4 L', coverage: 88, status: 'Stable' },
      { district: 'Kolkata', beneficiaries: '1.1 L', active: '0.9 L', coverage: 81, status: 'Stable' },
    ],
    fundUtilization: { allocated: '₹2,340 Cr', disbursed: '₹2,010 Cr', pending: '₹330 Cr', utilizationPct: 86 },
  },
  NSAP: {
    key: 'NSAP',
    summary: 'Social assistance pension for elderly, widowed and disabled citizens below the poverty line.',
    trend: [
      { period: 'Q1 FY25-26', active: '31.4 L', growth: '+0.6%' },
      { period: 'Q2 FY25-26', active: '31.0 L', growth: '-0.9%' },
      { period: 'Q3 FY25-26', active: '30.6 L', growth: '-1.4%' },
      { period: 'Q4 FY25-26', active: '30.2 L', growth: '-1.8%' },
    ],
    districtBreakdown: [
      { district: 'Kolkata', beneficiaries: '2.4 L', active: '2.3 L', coverage: 92, status: 'Stable' },
      { district: 'Hooghly', beneficiaries: '5.1 L', active: '4.7 L', coverage: 84, status: 'Stable' },
      { district: 'Nadia', beneficiaries: '6.0 L', active: '5.3 L', coverage: 79, status: 'Watch' },
      { district: 'Malda', beneficiaries: '4.8 L', active: '3.9 L', coverage: 68, status: 'Watch' },
      { district: 'Purulia', beneficiaries: '3.9 L', active: '3.0 L', coverage: 62, status: 'Watch' },
    ],
    fundUtilization: { allocated: '₹980 Cr', disbursed: '₹812 Cr', pending: '₹168 Cr', utilizationPct: 83 },
  },
  'Swasthya Sathi': {
    key: 'Swasthya Sathi',
    summary: 'Cashless health insurance cover for families, including tertiary care at empanelled hospitals.',
    trend: [
      { period: 'Q1 FY25-26', active: '1.84 Cr', growth: '+4.9%' },
      { period: 'Q2 FY25-26', active: '1.88 Cr', growth: '+5.4%' },
      { period: 'Q3 FY25-26', active: '1.91 Cr', growth: '+5.9%' },
      { period: 'Q4 FY25-26', active: '1.93 Cr', growth: '+6.3%' },
    ],
    districtBreakdown: [
      { district: 'Kolkata', beneficiaries: '18.9 L', active: '18.2 L', coverage: 96, status: 'Stable' },
      { district: 'Hooghly', beneficiaries: '21.4 L', active: '20.1 L', coverage: 94, status: 'Growing' },
      { district: 'Nadia', beneficiaries: '24.6 L', active: '22.9 L', coverage: 93, status: 'Growing' },
      { district: 'Malda', beneficiaries: '19.1 L', active: '17.2 L', coverage: 90, status: 'Stable' },
      { district: 'Purulia', beneficiaries: '14.8 L', active: '12.9 L', coverage: 87, status: 'Stable' },
    ],
    fundUtilization: { allocated: '₹5,260 Cr', disbursed: '₹4,780 Cr', pending: '₹480 Cr', utilizationPct: 91 },
  },
};