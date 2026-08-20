import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FuzzyHeaderComponent } from '../../../fuzzy-match/components/fuzzy-header/fuzzy-header';
import { FuzzyMatchRecord } from '../../../fuzzy-match/models/fuzzy-match-record.model';
import { FuzzyMatchService } from '../../../fuzzy-match/services/fuzzy-match.service';
import { MatchWorkbenchTableComponent } from '../../components/match-workbench-table/match-workbench-table';

@Component({ selector: 'app-match-workbench', standalone: true, imports: [FuzzyHeaderComponent, MatchWorkbenchTableComponent], templateUrl: './match-workbench.html', styleUrl: './match-workbench.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class MatchWorkbenchPage {
  private readonly service = inject(FuzzyMatchService);
  readonly threshold = signal(75); readonly records = signal<FuzzyMatchRecord[]>([]); readonly loading = signal(true); readonly regenerating = signal(false); readonly error = signal<string | null>(null); readonly selectedRecord = signal<FuzzyMatchRecord | null>(null);
  constructor() { this.loadRecords(); }
  setThreshold(value: number): void { this.threshold.set(value); }
  inspect(record: FuzzyMatchRecord): void { this.selectedRecord.set(record); }
  closeInspect(): void { this.selectedRecord.set(null); }
  regenerate(): void { if (this.regenerating()) return; this.regenerating.set(true); this.service.regenerateEngineData().pipe(finalize(() => this.regenerating.set(false))).subscribe({ next: () => this.loadRecords(), error: () => this.error.set('Unable to regenerate engine data.') }); }
  loadRecords(): void { this.loading.set(true); this.service.getFuzzyMatchRecords().pipe(finalize(() => this.loading.set(false))).subscribe({ next: (records) => this.records.set(records), error: () => this.error.set('Unable to load match records.') }); }
}
