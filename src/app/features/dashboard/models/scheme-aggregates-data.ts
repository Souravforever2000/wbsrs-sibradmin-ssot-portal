import { SchemeMasterAggregate } from '../models/scheme.models';

// TEMPORARY hardcoded data, shaped to match SchemeMasterAggregate exactly.
// Replace with a real SchemeAggregateService call against srs_master once
// the aggregation endpoint exists. Keys must match the scheme name used in
// configs['schemes'].rows[i][0] (operational-workspace.ts).

export const SCHEME_AGGREGATES: Record<string, SchemeMasterAggregate> = {
  'PM-KISAN': {
    schemeId: 'PM-KISAN',
    totalBeneficiaries: 1210000,
    dataQuality: {
      withMobile: 1042000,
      withPan: 683000,
      withEpic: 951000,
      avgConfidenceScore: 0.91,
      dobMismatchCount: 58000,
    },
    districtBreakdown: [
      { lgdDistrictCode: 331, districtName: 'Nadia', count: 182000 },
      { lgdDistrictCode: 335, districtName: 'Hooghly', count: 154000 },
      { lgdDistrictCode: 319, districtName: 'Kolkata', count: 21000 },
      { lgdDistrictCode: 344, districtName: 'Malda', count: 118000 },
      { lgdDistrictCode: 349, districtName: 'Purulia', count: 96000 },
    ],
    genderBreakdown: [
      { gender: 'Male', count: 742000 },
      { gender: 'Female', count: 461000 },
      { gender: null, count: 7000 },
    ],
    casteBreakdown: [
      { caste: 'General', count: 398000 },
      { caste: 'OBC', count: 361000 },
      { caste: 'SC', count: 312000 },
      { caste: 'ST', count: 104000 },
      { caste: null, count: 35000 },
    ],
    rationCardTypeBreakdown: [
      { code: 'PHH', count: 512000 },
      { code: 'AAY', count: 214000 },
      { code: 'SPHH', count: 318000 },
      { code: null, count: 166000 },
    ],
    dataGradeBreakdown: [
      { grade: 9, count: 512000 },
      { grade: 8, count: 344000 },
      { grade: 6, count: 210000 },
      { grade: 4, count: 98000 },
      { grade: null, count: 46000 },
    ],
  },

  NFSA: {
    schemeId: 'NFSA',
    totalBeneficiaries: 18400000,
    dataQuality: {
      withMobile: 14200000,
      withPan: 5100000,
      withEpic: 15600000,
      avgConfidenceScore: 0.94,
      dobMismatchCount: 612000,
    },
    districtBreakdown: [
      { lgdDistrictCode: 319, districtName: 'Kolkata', count: 910000 },
      { lgdDistrictCode: 331, districtName: 'Nadia', count: 2240000 },
      { lgdDistrictCode: 335, districtName: 'Hooghly', count: 1980000 },
      { lgdDistrictCode: 344, districtName: 'Malda', count: 1720000 },
      { lgdDistrictCode: 349, districtName: 'Purulia', count: 1090000 },
    ],
    genderBreakdown: [
      { gender: 'Male', count: 9100000 },
      { gender: 'Female', count: 9180000 },
      { gender: null, count: 120000 },
    ],
    casteBreakdown: [
      { caste: 'General', count: 5200000 },
      { caste: 'OBC', count: 5600000 },
      { caste: 'SC', count: 5100000 },
      { caste: 'ST', count: 1900000 },
      { caste: null, count: 600000 },
    ],
    rationCardTypeBreakdown: [
      { code: 'PHH', count: 11200000 },
      { code: 'AAY', count: 4100000 },
      { code: 'SPHH', count: 2400000 },
      { code: null, count: 700000 },
    ],
    dataGradeBreakdown: [
      { grade: 9, count: 9800000 },
      { grade: 8, count: 4900000 },
      { grade: 6, count: 2600000 },
      { grade: 4, count: 800000 },
      { grade: null, count: 300000 },
    ],
  },

  MGNREGA: {
    schemeId: 'MGNREGA',
    totalBeneficiaries: 7420000,
    dataQuality: {
      withMobile: 6100000,
      withPan: 1200000,
      withEpic: 6800000,
      avgConfidenceScore: 0.88,
      dobMismatchCount: 340000,
    },
    districtBreakdown: [
      { lgdDistrictCode: 349, districtName: 'Purulia', count: 1120000 },
      { lgdDistrictCode: 344, districtName: 'Malda', count: 1360000 },
      { lgdDistrictCode: 335, districtName: 'Hooghly', count: 980000 },
      { lgdDistrictCode: 331, districtName: 'Nadia', count: 1410000 },
      { lgdDistrictCode: 319, districtName: 'Kolkata', count: 110000 },
    ],
    genderBreakdown: [
      { gender: 'Male', count: 3900000 },
      { gender: 'Female', count: 3480000 },
      { gender: null, count: 40000 },
    ],
    casteBreakdown: [
      { caste: 'General', count: 1600000 },
      { caste: 'OBC', count: 2100000 },
      { caste: 'SC', count: 2400000 },
      { caste: 'ST', count: 1120000 },
      { caste: null, count: 200000 },
    ],
    rationCardTypeBreakdown: [
      { code: 'PHH', count: 4200000 },
      { code: 'AAY', count: 1800000 },
      { code: 'SPHH', count: 1020000 },
      { code: null, count: 400000 },
    ],
    dataGradeBreakdown: [
      { grade: 9, count: 3100000 },
      { grade: 8, count: 2400000 },
      { grade: 6, count: 1300000 },
      { grade: 4, count: 500000 },
      { grade: null, count: 120000 },
    ],
  },

  NSAP: {
    schemeId: 'NSAP',
    totalBeneficiaries: 3270000,
    dataQuality: {
      withMobile: 1980000,
      withPan: 410000,
      withEpic: 2900000,
      avgConfidenceScore: 0.82,
      dobMismatchCount: 289000,
    },
    districtBreakdown: [
      { lgdDistrictCode: 319, districtName: 'Kolkata', count: 240000 },
      { lgdDistrictCode: 335, districtName: 'Hooghly', count: 510000 },
      { lgdDistrictCode: 331, districtName: 'Nadia', count: 600000 },
      { lgdDistrictCode: 344, districtName: 'Malda', count: 480000 },
      { lgdDistrictCode: 349, districtName: 'Purulia', count: 390000 },
    ],
    genderBreakdown: [
      { gender: 'Male', count: 1180000 },
      { gender: 'Female', count: 2020000 },
      { gender: null, count: 70000 },
    ],
    casteBreakdown: [
      { caste: 'General', count: 980000 },
      { caste: 'OBC', count: 890000 },
      { caste: 'SC', count: 940000 },
      { caste: 'ST', count: 340000 },
      { caste: null, count: 120000 },
    ],
    rationCardTypeBreakdown: [
      { code: 'PHH', count: 1900000 },
      { code: 'AAY', count: 820000 },
      { code: 'SPHH', count: 410000 },
      { code: null, count: 140000 },
    ],
    dataGradeBreakdown: [
      { grade: 9, count: 1200000 },
      { grade: 8, count: 980000 },
      { grade: 6, count: 640000 },
      { grade: 4, count: 340000 },
      { grade: null, count: 110000 },
    ],
  },

  'Swasthya Sathi': {
    schemeId: 'Swasthya Sathi',
    totalBeneficiaries: 20600000,
    dataQuality: {
      withMobile: 17800000,
      withPan: 3200000,
      withEpic: 18100000,
      avgConfidenceScore: 0.93,
      dobMismatchCount: 540000,
    },
    districtBreakdown: [
      { lgdDistrictCode: 319, districtName: 'Kolkata', count: 1890000 },
      { lgdDistrictCode: 335, districtName: 'Hooghly', count: 2140000 },
      { lgdDistrictCode: 331, districtName: 'Nadia', count: 2460000 },
      { lgdDistrictCode: 344, districtName: 'Malda', count: 1910000 },
      { lgdDistrictCode: 349, districtName: 'Purulia', count: 1480000 },
    ],
    genderBreakdown: [
      { gender: 'Male', count: 10200000 },
      { gender: 'Female', count: 10100000 },
      { gender: null, count: 300000 },
    ],
    casteBreakdown: [
      { caste: 'General', count: 6800000 },
      { caste: 'OBC', count: 6200000 },
      { caste: 'SC', count: 5400000 },
      { caste: 'ST', count: 1600000 },
      { caste: null, count: 600000 },
    ],
    rationCardTypeBreakdown: [
      { code: 'PHH', count: 12400000 },
      { code: 'AAY', count: 4600000 },
      { code: 'SPHH', count: 2900000 },
      { code: null, count: 700000 },
    ],
    dataGradeBreakdown: [
      { grade: 9, count: 11200000 },
      { grade: 8, count: 5800000 },
      { grade: 6, count: 2600000 },
      { grade: 4, count: 700000 },
      { grade: null, count: 300000 },
    ],
  },
};