export type FuzzyMatchStatus = 'MATCHED' | 'REVIEW_REQUIRED' | 'NOT_MATCHED';

export interface FuzzyMatchResult {
  jaroWinklerScore: number;
  levenshteinScore: number;
  tokenSortScore: number;
  soundexMaster: string;
  soundexScheme: string;
  phoneticMatch: boolean;
  finalScore: number;
  threshold: number;
  status: FuzzyMatchStatus;
}
