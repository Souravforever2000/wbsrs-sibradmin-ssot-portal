import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/api/api.service';
import { FuzzyMatchRecord } from '../models/fuzzy-match-record.model';
import { FuzzyMatchRequest } from '../models/fuzzy-match-request.model';
import { FuzzyMatchResult } from '../models/fuzzy-match-result.model';

const records: FuzzyMatchRecord[] = [
  { memberUid: '771837288237', masterName: 'Amit Mahapatra', schemeName: 'Ramesh Mahapatra', schemeCode: 'SCH_HEALTH', jaroWinklerScore: 81, levenshteinScore: 75, tokenSortScore: 25, soundexMaster: 'A535', soundexScheme: 'R525', finalScore: 60 },
  { memberUid: '771837288237', masterName: 'Amit Mahapatra', schemeName: 'Anita Mahapatra', schemeCode: 'SCH_MGNREGA', jaroWinklerScore: 81, levenshteinScore: 87, tokenSortScore: 87, soundexMaster: 'A535', soundexScheme: 'A535', finalScore: 85 },
];

@Injectable({ providedIn: 'root' })
export class FuzzyMatchService {
  private readonly api = inject(ApiService);

  calculateMatch(request: FuzzyMatchRequest): Observable<FuzzyMatchResult> {
    return environment.useMockApi ? of(this.calculateDemo(request)).pipe(delay(180)) : this.api.post<FuzzyMatchResult>('/fuzzy-match/calculate', request);
  }
  getFuzzyMatchRecords(): Observable<FuzzyMatchRecord[]> {
    return environment.useMockApi ? of(records).pipe(delay(180)) : this.api.get<FuzzyMatchRecord[]>('/fuzzy-match/records');
  }
  regenerateEngineData(): Observable<void> {
    return environment.useMockApi ? of(void 0).pipe(delay(350)) : this.api.post<void>('/fuzzy-match/regenerate', {});
  }

  private calculateDemo({ masterName, schemeName, threshold }: FuzzyMatchRequest): FuzzyMatchResult {
    const normal = (value: string) => value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const source = normal(masterName); const target = normal(schemeName);
    const token = this.tokenScore(source, target); const levenshtein = this.editScore(source, target);
    const jaro = Math.min(100, Math.round((token * .55 + levenshtein * .45) + (source.slice(0, 2) === target.slice(0, 2) ? 8 : 0)));
    const masterSoundex = this.soundex(source); const schemeSoundex = this.soundex(target);
    const finalScore = Math.round((jaro + levenshtein + token) / 3 * 10) / 10;
    return { jaroWinklerScore: jaro, levenshteinScore: levenshtein, tokenSortScore: token, soundexMaster: masterSoundex, soundexScheme: schemeSoundex, phoneticMatch: masterSoundex === schemeSoundex, finalScore, threshold, status: finalScore >= threshold ? 'MATCHED' : finalScore >= threshold - 15 ? 'REVIEW_REQUIRED' : 'NOT_MATCHED' };
  }
  private tokenScore(a: string, b: string): number { const x = a.split(/\s+/).sort().join(' '); const y = b.split(/\s+/).sort().join(' '); return this.editScore(x, y); }
  private editScore(a: string, b: string): number { if (!a || !b) return 0; const row = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) { let previous = row[0]++; for (let j = 1; j <= b.length; j++) { const current = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = current; } } return Math.round((1 - row[b.length] / Math.max(a.length, b.length)) * 100); }
  private soundex(value: string): string { const letters = value.replace(/[^A-Z]/g, ''); if (!letters) return '0000'; const code: Record<string, string> = { B:'1',F:'1',P:'1',V:'1',C:'2',G:'2',J:'2',K:'2',Q:'2',S:'2',X:'2',Z:'2',D:'3',T:'3',L:'4',M:'5',N:'5',R:'6' }; let last = code[letters[0]] ?? ''; let result = letters[0]; for (const letter of letters.slice(1)) { const next = code[letter] ?? ''; if (next && next !== last) result += next; last = next; } return (result + '000').slice(0, 4); }
}
