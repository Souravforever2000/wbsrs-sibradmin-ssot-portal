// Model describing scheme-level aggregates derived from srs_master.
// Mirrors the shape returned by the backend aggregation endpoint
// (grouped counts over scheme_id_list membership).

export interface SchemeDistrictCount {
  lgdDistrictCode: number;
  districtName?: string; // resolved client- or server-side via LGD code lookup
  count: number;
}

export interface SchemeGenderCount {
  gender: string | null;
  count: number;
}

export interface SchemeCasteCount {
  caste: string | null;
  count: number;
}

export interface SchemeRationCardTypeCount {
  code: string | null;
  count: number;
}

export interface SchemeDataGradeCount {
  grade: number | null;
  count: number;
}

export interface SchemeDataQuality {
  withMobile: number;
  withPan: number;
  withEpic: number;
  avgConfidenceScore: number; // 0.00–1.00, from confidence_score
  dobMismatchCount: number; // member_dob !== dob_as_per_aadhar
}

export interface SchemeMasterAggregate {
  schemeId: string;
  totalBeneficiaries: number;
  dataQuality: SchemeDataQuality;
  districtBreakdown: SchemeDistrictCount[];
  genderBreakdown: SchemeGenderCount[];
  casteBreakdown: SchemeCasteCount[];
  rationCardTypeBreakdown: SchemeRationCardTypeCount[];
  dataGradeBreakdown: SchemeDataGradeCount[];
}