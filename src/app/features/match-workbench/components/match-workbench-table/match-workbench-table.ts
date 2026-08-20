import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FuzzyMatchRecord } from '../../../fuzzy-match/models/fuzzy-match-record.model';
@Component({ selector: 'app-match-workbench-table', standalone: true, templateUrl: './match-workbench-table.html', styleUrl: './match-workbench-table.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class MatchWorkbenchTableComponent { readonly records = input<FuzzyMatchRecord[]>([]); readonly loading = input(false); readonly inspectRecord = output<FuzzyMatchRecord>(); }
