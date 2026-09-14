import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { FilterStateService } from '../../../../shared/services/filter-state.service';
import { downloadCsv } from '../../../../shared/utils/csv-export.util';
import { DISTRICT_PROFILES } from '../../data/district-profiles';
import type { DistrictAnalytics } from '../../models/district.models';
import { DistrictAnalyticsComponent } from '../district-analytics/district-analytics';
import { DistrictMapComponent } from '../district-map/district-map';

@Component({
  selector: 'app-state-overview',
  standalone: true,
  imports: [DistrictMapComponent, DistrictAnalyticsComponent],
  templateUrl: './state-overview.html',
  styleUrl: './state-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateOverviewComponent {
  private readonly state = inject(FilterStateService);

  readonly selectedDistrict = signal<string | null>(null);

  readonly activeDistrict = computed<DistrictAnalytics>(() => {
    const districtName = this.getActiveDistrictName();
    return DISTRICT_PROFILES[districtName] ?? this.createFallbackDistrict(districtName);
  });

  onDistrictSelected(name: string): void {
    const normalizedName = this.normalizeDistrictName(name);
    this.selectedDistrict.set(normalizedName);
    this.state.update({ district: normalizedName, block: 'All blocks' });
  }

  // --- CSV export ---

  exportDistrictsCsv(): void {
    const rows = Object.values(DISTRICT_PROFILES).map((d) => ({
      District: d.name,
      'LGD district code': d.lgdDistrictCode,
      'Unique UID count': d.uniqueUid,
      'Total citizens': d.totalCitizens,
      'Male %': d.malePercentage,
      'Female %': d.femalePercentage,
      'Alive %': d.alivePercentage,
      'Death %': d.deathPercentage,
      'Active valid ration card %': d.activeValidRationCardPercentage,
      'Avg schemes / citizen': d.avgSchemesPerCitizen,
      'Zero scheme %': d.zeroSchemePercent,
      'Match rate %': d.matchRate,
      'Highest beneficiary scheme': d.highestBeneficiaryScheme,
      'Highest beneficiary count': d.highestBeneficiaryCount,
      'Top schemes': d.topSchemes?.map((s: any) => `${s.name ?? s.label} (${s.count ?? s.value})`).join('; ') ?? '',
      'Age bands': d.ageBands?.map((b: any) => `${b.label}: ${b.value}`).join('; ') ?? '',
      Status: d.tone,
    }));

    downloadCsv(`district-analytics-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  private getActiveDistrictName(): string {
    const selected = this.selectedDistrict();
    if (selected) return selected;

    const globalDistrict = this.state.filters().district;
    if (globalDistrict && globalDistrict !== 'All districts') {
      return this.normalizeDistrictName(globalDistrict);
    }

    return 'Nadia';
  }

  private normalizeDistrictName(name: string): string {
    const normalized = name.trim().replace(/\s+/g, ' ').replace(/^district\s+/i, '');
    const aliases: Record<string, string> = {
      'North Twenty Four Parganas': 'North 24 Parganas',
      '24 Parganas North': 'North 24 Parganas',
      'South Twenty Four Parganas': 'South 24 Parganas',
      '24 Parganas South': 'South 24 Parganas',
      Coochbehar: 'Cooch Behar',
      'East Midnapore': 'Purba Medinipur',
      'East Midnapur': 'Purba Medinipur',
      'West Midnapore': 'Paschim Medinipur',
      'West Midnapur': 'Paschim Medinipur',
      Calcutta: 'Kolkata',
      Bardhaman: 'Purba Bardhaman',
      'East Bardhaman': 'Purba Bardhaman',
      'West Bardhaman': 'Paschim Bardhaman',
      Maldah: 'Malda',
      'South Dinajpur': 'Dakshin Dinajpur',
      'North Dinajpur': 'Uttar Dinajpur',
    };

    return aliases[normalized] ?? normalized;
  }

  private createFallbackDistrict(name: string): DistrictAnalytics {
    return {
      name,
      lgdDistrictCode: 'N/A',
      uniqueUid: 'N/A',
      highestBeneficiaryScheme: 'N/A',
      highestBeneficiaryCount: 0,
      totalCitizens: 0,
      malePercentage: 0,
      femalePercentage: 0,
      ageBands: [],
      deathFlag: 0,
      aliveFlag: 0,
      deathPercentage: 0,
      alivePercentage: 0,
      activeValidRationCardPercentage: 0,
      topSchemes: [],
      avgSchemesPerCitizen: 0,
      zeroSchemePercent: 0,
      matchRate: 0,
      tone: 'watch',
    };
  }
}