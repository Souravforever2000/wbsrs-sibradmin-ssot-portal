import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FilterStateService } from '../../../../shared/services/filter-state.service';
import { GlobalFiltersComponent } from '../../../../shared/components/global-filters/global-filters';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card';
import { PageHeadingComponent } from '../../../../shared/components/page-heading/page-heading';
import { DashboardChartsComponent } from '../../components/dashboard-charts/dashboard-charts';
import { DashboardService } from '../../services/dashboard.service';

type DistrictMetric = {
  label: string;
  value: string;
};

type DistrictAnalytics = {
  name: string;
  lgdDistrictCode: string;
  uniqueUid: string;
  highestBeneficiaryScheme: string;
  highestBeneficiaryCount: number;
  totalCitizens: number;
  malePercentage: number;
  femalePercentage: number;
  ageBands: DistrictMetric[];
  deathFlag: number;
  aliveFlag: number;
  deathPercentage: number;
  alivePercentage: number;
  activeValidRationCardPercentage: number;
  topSchemes: DistrictMetric[];
  avgSchemesPerCitizen: number;
  zeroSchemePercent: number;
  matchRate: number;
  tone: 'good' | 'watch' | 'risk';
};

type DistrictFeature = {
  type: 'Feature';
  properties: { name: string };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
};

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, GlobalFiltersComponent, KpiCardComponent, PageHeadingComponent, DashboardChartsComponent],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverviewPage {
  readonly service = inject(DashboardService);
  readonly state = inject(FilterStateService);
  readonly dashboard$ = this.service.getDashboard();
  readonly insights$ = this.service.getInsights();
  readonly performance$ = this.service.getDistrictPerformance();
  readonly hoveredDistrict = signal<string | null>(null);

  readonly districtGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Nadia' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[120, 110], [210, 100], [245, 160], [215, 245], [150, 255], [110, 190], [120, 110]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Murshidabad' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[205, 150], [285, 120], [325, 170], [300, 245], [220, 250], [200, 200], [205, 150]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'North 24 Parganas' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[82, 205], [140, 185], [175, 245], [150, 305], [100, 325], [70, 265], [82, 205]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Hooghly' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[230, 260], [305, 245], [350, 290], [330, 345], [260, 365], [220, 325], [230, 260]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Purulia' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[300, 70], [390, 90], [440, 150], [400, 220], [330, 250], [285, 170], [300, 70]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Kolkata' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[135, 290], [210, 285], [232, 325], [198, 368], [135, 355], [118, 325], [135, 290]]],
        },
      },
      {
        type: 'Feature',
        properties: { name: 'Malda' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[355, 215], [445, 205], [495, 260], [470, 330], [390, 355], [345, 290], [355, 215]]],
        },
      },
    ],
  } as const;

  readonly districtFeatures = this.districtGeoJson.features as unknown as DistrictFeature[];

  readonly districtProfiles: Record<string, DistrictAnalytics> = {
    Kolkata: {
      name: 'Kolkata',
      lgdDistrictCode: '19',
      uniqueUid: '4,82,940',
      highestBeneficiaryScheme: 'PM-KISAN',
      highestBeneficiaryCount: 142540,
      totalCitizens: 482940,
      malePercentage: 51.2,
      femalePercentage: 48.8,
      ageBands: [
        { label: '0-17', value: '23%' },
        { label: '18-35', value: '31%' },
        { label: '36-59', value: '35%' },
        { label: '60+', value: '11%' },
      ],
      deathFlag: 280,
      aliveFlag: 482660,
      deathPercentage: 0.06,
      alivePercentage: 99.94,
      activeValidRationCardPercentage: 92.4,
      topSchemes: [
        { label: 'PM-KISAN', value: '1,42,540' },
        { label: 'NFSA', value: '1,28,760' },
        { label: 'Swasthya Sathi', value: '94,680' },
        { label: 'MGNREGA', value: '82,440' },
        { label: 'NSAP', value: '63,110' },
      ],
      avgSchemesPerCitizen: 2.4,
      zeroSchemePercent: 14.8,
      matchRate: 97.8,
      tone: 'good',
    },
    Nadia: {
      name: 'Nadia',
      lgdDistrictCode: '11',
      uniqueUid: '5,68,440',
      highestBeneficiaryScheme: 'NFSA',
      highestBeneficiaryCount: 168240,
      totalCitizens: 568440,
      malePercentage: 50.9,
      femalePercentage: 49.1,
      ageBands: [
        { label: '0-17', value: '24%' },
        { label: '18-35', value: '29%' },
        { label: '36-59', value: '33%' },
        { label: '60+', value: '14%' },
      ],
      deathFlag: 420,
      aliveFlag: 568020,
      deathPercentage: 0.07,
      alivePercentage: 99.93,
      activeValidRationCardPercentage: 94.7,
      topSchemes: [
        { label: 'NFSA', value: '1,68,240' },
        { label: 'PM-KISAN', value: '1,56,980' },
        { label: 'Swasthya Sathi', value: '1,12,640' },
        { label: 'MGNREGA', value: '96,820' },
        { label: 'NSAP', value: '71,260' },
      ],
      avgSchemesPerCitizen: 2.7,
      zeroSchemePercent: 11.6,
      matchRate: 96.7,
      tone: 'good',
    },
    Hooghly: {
      name: 'Hooghly',
      lgdDistrictCode: '12',
      uniqueUid: '5,98,420',
      highestBeneficiaryScheme: 'PM-KISAN',
      highestBeneficiaryCount: 176880,
      totalCitizens: 598420,
      malePercentage: 52.1,
      femalePercentage: 47.9,
      ageBands: [
        { label: '0-17', value: '22%' },
        { label: '18-35', value: '32%' },
        { label: '36-59', value: '34%' },
        { label: '60+', value: '12%' },
      ],
      deathFlag: 510,
      aliveFlag: 597910,
      deathPercentage: 0.09,
      alivePercentage: 99.91,
      activeValidRationCardPercentage: 91.8,
      topSchemes: [
        { label: 'PM-KISAN', value: '1,76,880' },
        { label: 'NFSA', value: '1,57,460' },
        { label: 'Swasthya Sathi', value: '1,18,240' },
        { label: 'MGNREGA', value: '93,610' },
        { label: 'NSAP', value: '68,310' },
      ],
      avgSchemesPerCitizen: 2.5,
      zeroSchemePercent: 12.4,
      matchRate: 94.8,
      tone: 'good',
    },
    Malda: {
      name: 'Malda',
      lgdDistrictCode: '24',
      uniqueUid: '4,12,760',
      highestBeneficiaryScheme: 'NFSA',
      highestBeneficiaryCount: 119340,
      totalCitizens: 412760,
      malePercentage: 49.7,
      femalePercentage: 50.3,
      ageBands: [
        { label: '0-17', value: '28%' },
        { label: '18-35', value: '28%' },
        { label: '36-59', value: '31%' },
        { label: '60+', value: '13%' },
      ],
      deathFlag: 620,
      aliveFlag: 412140,
      deathPercentage: 0.15,
      alivePercentage: 99.85,
      activeValidRationCardPercentage: 88.2,
      topSchemes: [
        { label: 'NFSA', value: '1,19,340' },
        { label: 'PM-KISAN', value: '1,06,720' },
        { label: 'Swasthya Sathi', value: '94,660' },
        { label: 'MGNREGA', value: '82,310' },
        { label: 'NSAP', value: '57,420' },
      ],
      avgSchemesPerCitizen: 2.2,
      zeroSchemePercent: 18.3,
      matchRate: 74.5,
      tone: 'watch',
    },
    Purulia: {
      name: 'Purulia',
      lgdDistrictCode: '23',
      uniqueUid: '2,92,640',
      highestBeneficiaryScheme: 'MGNREGA',
      highestBeneficiaryCount: 88420,
      totalCitizens: 292640,
      malePercentage: 52.6,
      femalePercentage: 47.4,
      ageBands: [
        { label: '0-17', value: '29%' },
        { label: '18-35', value: '27%' },
        { label: '36-59', value: '30%' },
        { label: '60+', value: '14%' },
      ],
      deathFlag: 780,
      aliveFlag: 291860,
      deathPercentage: 0.27,
      alivePercentage: 99.73,
      activeValidRationCardPercentage: 84.6,
      topSchemes: [
        { label: 'MGNREGA', value: '88,420' },
        { label: 'NFSA', value: '83,620' },
        { label: 'PM-KISAN', value: '72,540' },
        { label: 'Swasthya Sathi', value: '68,440' },
        { label: 'NSAP', value: '49,180' },
      ],
      avgSchemesPerCitizen: 1.9,
      zeroSchemePercent: 22.1,
      matchRate: 71.2,
      tone: 'risk',
    },
    'North 24 Parganas': {
      name: 'North 24 Parganas',
      lgdDistrictCode: '12A',
      uniqueUid: '6,40,130',
      highestBeneficiaryScheme: 'PM-KISAN',
      highestBeneficiaryCount: 192130,
      totalCitizens: 640130,
      malePercentage: 50.8,
      femalePercentage: 49.2,
      ageBands: [
        { label: '0-17', value: '23%' },
        { label: '18-35', value: '34%' },
        { label: '36-59', value: '31%' },
        { label: '60+', value: '12%' },
      ],
      deathFlag: 340,
      aliveFlag: 639790,
      deathPercentage: 0.05,
      alivePercentage: 99.95,
      activeValidRationCardPercentage: 93.5,
      topSchemes: [
        { label: 'PM-KISAN', value: '1,92,130' },
        { label: 'NFSA', value: '1,70,260' },
        { label: 'Swasthya Sathi', value: '1,26,880' },
        { label: 'MGNREGA', value: '99,710' },
        { label: 'NSAP', value: '74,980' },
      ],
      avgSchemesPerCitizen: 2.8,
      zeroSchemePercent: 10.9,
      matchRate: 92.6,
      tone: 'good',
    },
  };

  readonly districtOrder = Object.keys(this.districtProfiles);

  readonly activeDistrictName = computed(() => {
    const selected = this.state.filters().district;
    if (selected && selected !== 'All districts' && this.districtProfiles[selected]) {
      return selected;
    }

    const hovered = this.hoveredDistrict();
    if (hovered && this.districtProfiles[hovered]) {
      return hovered;
    }

    return 'Nadia';
  });

  readonly activeDistrict = computed(
    () => this.districtProfiles[this.activeDistrictName()] ?? this.districtProfiles['Nadia'],
  );

  toSvgPath(coordinates: number[][]): string {
    return coordinates.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
  }

  selectDistrict(name: string): void {
    this.state.update({ district: name, block: 'All blocks' });
    this.hoveredDistrict.set(null);
  }

  clearHover(): void {
    const selected = this.state.filters().district;
    if (selected && selected !== 'All districts') {
      return;
    }
    this.hoveredDistrict.set(null);
  }
}
