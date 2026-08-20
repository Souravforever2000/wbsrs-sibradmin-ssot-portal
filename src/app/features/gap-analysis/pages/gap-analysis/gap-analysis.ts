import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FuzzyHeaderComponent } from '../../../fuzzy-match/components/fuzzy-header/fuzzy-header';

interface GapRecord { uid: string; scheme: string; masterName: string; schemeName: string; trigger: 'DOB Variance' | 'Gender Mismatch' | 'Gender Mismatch, DOB Variance'; confidence: number; masterDob: string; schemeDob: string; gender: string; caste: string; }

const records: GapRecord[] = [
  { uid: '776802774695', scheme: 'SCH_PMKISAN', masterName: 'Sita Patra', schemeName: 'Sita Patra', trigger: 'DOB Variance', confidence: 95, masterDob: '1991-10-23', schemeDob: '1989-10-23', gender: 'Female', caste: 'GENERAL' },
  { uid: '776802774695', scheme: 'SCH_NSAP', masterName: 'Sita Patra', schemeName: 'Sita Patra', trigger: 'DOB Variance', confidence: 95, masterDob: '1991-10-23', schemeDob: '1989-10-23', gender: 'Female', caste: 'GENERAL' },
  { uid: '702044098831', scheme: 'SCH_HEALTH', masterName: 'Kavita Raut', schemeName: 'Kavita Raut', trigger: 'DOB Variance', confidence: 95, masterDob: '1988-02-16', schemeDob: '1985-02-16', gender: 'Female', caste: 'GENERAL' },
  { uid: '745274325994', scheme: 'SCH_NFSA', masterName: 'Kavita Panda', schemeName: 'Kavita Panda', trigger: 'DOB Variance', confidence: 95, masterDob: '1982-06-11', schemeDob: '1979-06-11', gender: 'Female', caste: 'OBC' },
  { uid: '701199914272', scheme: 'SCH_HEALTH', masterName: 'Minati Pradhan', schemeName: 'Minati Pradhan', trigger: 'DOB Variance', confidence: 95, masterDob: '1978-04-19', schemeDob: '1975-04-19', gender: 'Female', caste: 'GENERAL' },
  { uid: '701199914272', scheme: 'SCH_MGNREGA', masterName: 'Minati Pradhan', schemeName: 'Minati Pradhan', trigger: 'DOB Variance', confidence: 95, masterDob: '1978-04-19', schemeDob: '1975-04-19', gender: 'Female', caste: 'GENERAL' },
  { uid: '713432488826', scheme: 'SCH_NFSA', masterName: 'Manoj Swain', schemeName: 'Manoj Swain', trigger: 'DOB Variance', confidence: 95, masterDob: '1974-08-10', schemeDob: '1971-08-10', gender: 'Male', caste: 'GENERAL' },
  { uid: '713432488826', scheme: 'SCH_PMKISAN', masterName: 'Manoj Swain', schemeName: 'Manoj Swain', trigger: 'Gender Mismatch, DOB Variance', confidence: 65, masterDob: '1974-08-10', schemeDob: '1971-08-10', gender: 'Male', caste: 'GENERAL' },
  { uid: '733924912865', scheme: 'SCH_HEALTH', masterName: 'Deepak Mohanty', schemeName: 'Deepak Mohanty', trigger: 'DOB Variance', confidence: 95, masterDob: '1980-01-14', schemeDob: '1977-01-14', gender: 'Male', caste: 'GENERAL' },
  { uid: '701583692270', scheme: 'SCH_HEALTH', masterName: 'Amit Mohanty', schemeName: 'Amit Mohanty', trigger: 'Gender Mismatch', confidence: 90, masterDob: '1986-05-20', schemeDob: '1986-05-20', gender: 'Male', caste: 'OBC' },
];

@Component({ selector: 'app-gap-analysis', standalone: true, imports: [CommonModule, FuzzyHeaderComponent], templateUrl: './gap-analysis.html', styleUrl: './gap-analysis.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class GapAnalysisPage {
  readonly rows = records; readonly selected = signal<GapRecord | null>(null); readonly activeTab = signal('All Discrepancies'); readonly threshold = signal(75);
  setThreshold(value: number): void { this.threshold.set(value); }
  inspect(row: GapRecord): void { this.selected.set(row); }
  close(): void { this.selected.set(null); }
}
