export interface FuzzyMatchRecord {
  memberUid: string;
  masterName: string;
  schemeName: string;
  schemeCode?: string;
  jaroWinklerScore: number;
  levenshteinScore: number;
  tokenSortScore: number;
  soundexMaster: string;
  soundexScheme: string;
  finalScore?: number;
}
