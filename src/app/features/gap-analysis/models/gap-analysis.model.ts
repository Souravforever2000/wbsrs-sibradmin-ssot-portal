export interface GapRecord {
  uid: string;
  district: string;
  block: string;
  department: string;
  scheme: string;
  masterName: string;
  schemeName: string;
  trigger: 'DOB Variance' | 'Gender Mismatch' | 'Gender Mismatch, DOB Variance';
  confidence: number;
  masterDob: string;
  schemeDob: string;
  gender: string;
  caste: string;
}

export interface GapAnalysisKpi {
  totalDiscrepancies: number;
  highPriorityGaps: number;
  averageConfidence: number;
  affectedMembers: number;
}

export interface GapTypeFrequency { type: string; count: number; }
export interface SchemeGapDistribution { schemeName: string; critical: number; moderate: number; low: number; }
export interface GapConfidenceDistribution { range: string; count: number; }
export interface GeographicGapAnalysis { name: string; totalGaps: number; }

export interface GapAnalysisSnapshot {
  summary: GapAnalysisKpi;
  tabCounts: { all: number; genderMismatch: number; dobVariance: number; lowConfidence: number };
  discrepancyFrequency: GapTypeFrequency[];
  schemeDistribution: SchemeGapDistribution[];
  confidenceDistribution: GapConfidenceDistribution[];
  geographicDistribution: GeographicGapAnalysis[];
  records: GapRecord[];
}
