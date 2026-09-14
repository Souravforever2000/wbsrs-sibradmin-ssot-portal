import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { downloadCsv } from '../../../../shared/utils/csv-export.util';
import type { DistrictAnalytics } from '../../models/district.models';

@Component({
  selector: 'app-district-analytics',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './district-analytics.html',
  styleUrl: './district-analytics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictAnalyticsComponent {
  readonly district = input.required<DistrictAnalytics>();

  exportDistrictCsv(): void {
    const d = this.district();

    const row = {
      District: d.name,
      'LGD district code': d.lgdDistrictCode,
      'Unique UID count': d.uniqueUid,
      'Total citizens': d.totalCitizens,
      'Male %': d.malePercentage,
      'Female %': d.femalePercentage,
      'Alive %': d.alivePercentage,
      'Death %': d.deathPercentage,
      'Alive flag': d.aliveFlag,
      'Death flag': d.deathFlag,
      'Active valid ration card %': d.activeValidRationCardPercentage,
      'Avg schemes / citizen': d.avgSchemesPerCitizen,
      'Zero scheme %': d.zeroSchemePercent,
      'Match rate %': d.matchRate,
      'Highest beneficiary scheme': d.highestBeneficiaryScheme,
      'Highest beneficiary count': d.highestBeneficiaryCount,
      'Top schemes': d.topSchemes?.map((s) => `${s.label} (${s.value})`).join('; ') ?? '',
      'Age bands': d.ageBands?.map((b) => `${b.label}: ${b.value}`).join('; ') ?? '',
      Status: d.tone,
    };

    const safeName = d.name.trim().toLowerCase().replace(/\s+/g, '-');
    downloadCsv(`${safeName}-district-analytics-${new Date().toISOString().slice(0, 10)}.csv`, [row]);
  }
}