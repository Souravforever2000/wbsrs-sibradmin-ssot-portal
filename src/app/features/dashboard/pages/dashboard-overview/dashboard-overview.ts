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

/* ============================= */
/* GEOJSON TYPES                  */
/* ============================= */

type DistrictProperties = {
  name?: string;
  NAME_2?: string;
  district?: string;
  DISTRICT?: string;
  dtname?: string;
  DTNAME?: string;
  stname?: string;
  STNAME?: string;
};

type DistrictFeature = {
  type: 'Feature';
  properties: DistrictProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
};

type WestBengalGeoJson = {
  type: 'FeatureCollection';
  features: DistrictFeature[];
};

type MapBounds = {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
};

type ProjectedDistrict = {
  feature: DistrictFeature;
  paths: string[];
};

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    GlobalFiltersComponent,
    KpiCardComponent,
    PageHeadingComponent,
    DashboardChartsComponent,
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverviewPage {
  readonly service = inject(DashboardService);
  readonly state = inject(FilterStateService);

  readonly dashboard$ = this.service.getDashboard();
  readonly insights$ = this.service.getInsights();
  readonly performance$ = this.service.getDistrictPerformance();

  /* ============================= */
  /* MAP STATE                      */
  /* ============================= */

  readonly selectedDistrict = signal<string | null>(null);
  readonly hoveredDistrict = signal<string | null>(null);

  readonly districtGeoJson = signal<WestBengalGeoJson | null>(null);

  /* ============================= */
  /* SVG MAP CONFIG                 */
  /* ============================= */

  private readonly mapWidth = 700;
  private readonly mapHeight = 520;
  private readonly mapPadding = 20;

  /* ============================= */
  /* LOAD GEOJSON                   */
  /* ============================= */

  constructor() {
    this.loadWestBengalMap();
  }

  private loadWestBengalMap(): void {
    fetch('assets/maps/west-bengal.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load west-bengal.geojson: ${response.status}`);
        }

        return response.json();
      })
      .then((geoJson: WestBengalGeoJson) => {
        if (geoJson.type !== 'FeatureCollection' || !Array.isArray(geoJson.features)) {
          throw new Error('Invalid West Bengal GeoJSON format.');
        }

        console.log('West Bengal GeoJSON loaded:', geoJson.features.length, 'district features');

        this.districtGeoJson.set(geoJson);
      })
      .catch((error) => {
        console.error('Unable to load West Bengal GeoJSON:', error);
      });
  }

  /* ============================= */
  /* GEOJSON FEATURES               */
  /* ============================= */

  readonly districtFeatures = computed(() => this.districtGeoJson()?.features ?? []);

  getDistrictName(feature: DistrictFeature): string {
    const properties = feature.properties as Record<string, unknown>;

    const rawName =
      properties['district'] ??
      properties['DISTRICT'] ??
      properties['District'] ??
      properties['NAME_2'] ??
      properties['name'] ??
      properties['NAME'] ??
      properties['dtname'] ??
      properties['DTNAME'];

    if (typeof rawName !== 'string') {
      return 'Unknown District';
    }

    return rawName.trim().replace(/\s+/g, ' ');
  }

  private normalizeDistrictName(name: string): string {
    const normalized = name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/^district\s+/i, '');

    const aliases: Record<string, string> = {
      'North 24 Parganas': 'North 24 Parganas',
      'North Twenty Four Parganas': 'North 24 Parganas',
      '24 Parganas North': 'North 24 Parganas',

      'South 24 Parganas': 'South 24 Parganas',
      'South Twenty Four Parganas': 'South 24 Parganas',
      '24 Parganas South': 'South 24 Parganas',

      'Cooch Behar': 'Cooch Behar',
      Coochbehar: 'Cooch Behar',

      'East Midnapore': 'Purba Medinipur',
      'East Midnapur': 'Purba Medinipur',
      'Purba Medinipur': 'Purba Medinipur',

      'West Midnapore': 'Paschim Medinipur',
      'West Midnapur': 'Paschim Medinipur',
      'Paschim Medinipur': 'Paschim Medinipur',

      Calcutta: 'Kolkata',
      Kolkata: 'Kolkata',

      Bardhaman: 'Purba Bardhaman',
      'East Bardhaman': 'Purba Bardhaman',
      'Purba Bardhaman': 'Purba Bardhaman',

      'West Bardhaman': 'Paschim Bardhaman',
      'Paschim Bardhaman': 'Paschim Bardhaman',

      Darjeeling: 'Darjeeling',
      Jalpaiguri: 'Jalpaiguri',
      Alipurduar: 'Alipurduar',
      Kalimpong: 'Kalimpong',
      'Uttar Dinajpur': 'Uttar Dinajpur',
      'Dakshin Dinajpur': 'Dakshin Dinajpur',
      Malda: 'Malda',
      Murshidabad: 'Murshidabad',
      Birbhum: 'Birbhum',
      Bankura: 'Bankura',
      Purulia: 'Purulia',
      Hooghly: 'Hooghly',
      Howrah: 'Howrah',
      Nadia: 'Nadia',
      Maldah: 'Malda',
      'South Dinajpur': 'Dakshin Dinajpur',
      'North Dinajpur': 'Uttar Dinajpur',
    };

    return aliases[normalized] ?? normalized;
  }

  /* ============================= */
  /* CALCULATE GEO BOUNDS            */
  /* ============================= */

  private calculateBounds(features: DistrictFeature[]): MapBounds {
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const feature of features) {
      this.forEachCoordinate(feature.geometry, ([lon, lat]) => {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);

        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
    }

    return {
      minLon,
      maxLon,
      minLat,
      maxLat,
    };
  }

  /* ============================= */
  /* ITERATE POLYGON COORDINATES    */
  /* ============================= */

  private forEachCoordinate(
    geometry: DistrictFeature['geometry'],
    callback: (coordinate: [number, number]) => void,
  ): void {
    if (geometry.type === 'Polygon') {
      const polygon = geometry.coordinates as number[][][];

      for (const ring of polygon) {
        for (const coordinate of ring) {
          callback(coordinate as [number, number]);
        }
      }

      return;
    }

    const multiPolygon = geometry.coordinates as number[][][][];

    for (const polygon of multiPolygon) {
      for (const ring of polygon) {
        for (const coordinate of ring) {
          callback(coordinate as [number, number]);
        }
      }
    }
  }

  private projectCoordinate(coordinate: [number, number], bounds: MapBounds): [number, number] {
    const { minLon, maxLon, minLat, maxLat } = bounds;

    const longitudeRange = maxLon - minLon || 1;

    const latitudeRange = maxLat - minLat || 1;

    /*
     * IMPORTANT:
     * Use one common scale for X and Y.
     *
     * This prevents the GeoJSON from being stretched
     * vertically or horizontally.
     */
    const availableWidth = this.mapWidth - this.mapPadding * 2;

    const availableHeight = this.mapHeight - this.mapPadding * 2;

    const scale = Math.min(availableWidth / longitudeRange, availableHeight / latitudeRange);

    const actualWidth = longitudeRange * scale;

    const actualHeight = latitudeRange * scale;

    /*
     * Center the map inside the SVG.
     */
    const offsetX = (this.mapWidth - actualWidth) / 2;

    const offsetY = (this.mapHeight - actualHeight) / 2;

    const x = offsetX + (coordinate[0] - minLon) * scale;

    /*
     * SVG Y-axis is inverted.
     */
    const y = offsetY + (maxLat - coordinate[1]) * scale;

    return [x, y];
  }

  private ringToSvgPath(ring: number[][], bounds: MapBounds): string {
    if (!ring.length) {
      return '';
    }

    return (
      ring
        .map(([lon, lat], index) => {
          const [x, y] = this.projectCoordinate([lon, lat], bounds);

          return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(' ') + ' Z'
    );
  }

  /* ============================= */
  /* GEOMETRY → SVG PATHS           */
  /* ============================= */

  private geometryToSvgPaths(geometry: DistrictFeature['geometry'], bounds: MapBounds): string[] {
    if (geometry.type === 'Polygon') {
      const polygon = geometry.coordinates as number[][][];

      return polygon.map((ring) => this.ringToSvgPath(ring, bounds)).filter(Boolean);
    }

    const multiPolygon = geometry.coordinates as number[][][][];

    return multiPolygon.flatMap((polygon) =>
      polygon.map((ring) => this.ringToSvgPath(ring, bounds)).filter(Boolean),
    );
  }

  /* ============================= */
  /* PROJECTED MAP                  */
  /* ============================= */

  readonly projectedDistricts = computed<ProjectedDistrict[]>(() => {
    const geoJson = this.districtGeoJson();

    if (!geoJson || !geoJson.features.length) {
      return [];
    }

    const bounds = this.calculateBounds(geoJson.features);

    return geoJson.features.map((feature) => ({
      feature,

      paths: this.geometryToSvgPaths(feature.geometry, bounds),
    }));
  });

  /* ============================= */
  /* DISTRICT PROFILES              */
  /* ============================= */

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
        {
          label: 'PM-KISAN',
          value: '1,42,540',
        },
        {
          label: 'NFSA',
          value: '1,28,760',
        },
        {
          label: 'Swasthya Sathi',
          value: '94,680',
        },
        {
          label: 'MGNREGA',
          value: '82,440',
        },
        {
          label: 'NSAP',
          value: '63,110',
        },
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
        {
          label: 'NFSA',
          value: '1,68,240',
        },
        {
          label: 'PM-KISAN',
          value: '1,56,980',
        },
        {
          label: 'Swasthya Sathi',
          value: '1,12,640',
        },
        {
          label: 'MGNREGA',
          value: '96,820',
        },
        {
          label: 'NSAP',
          value: '71,260',
        },
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
        {
          label: 'PM-KISAN',
          value: '1,76,880',
        },
        {
          label: 'NFSA',
          value: '1,57,460',
        },
        {
          label: 'Swasthya Sathi',
          value: '1,18,240',
        },
        {
          label: 'MGNREGA',
          value: '93,610',
        },
        {
          label: 'NSAP',
          value: '68,310',
        },
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
        {
          label: 'NFSA',
          value: '1,19,340',
        },
        {
          label: 'PM-KISAN',
          value: '1,06,720',
        },
        {
          label: 'Swasthya Sathi',
          value: '94,660',
        },
        {
          label: 'MGNREGA',
          value: '82,310',
        },
        {
          label: 'NSAP',
          value: '57,420',
        },
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
        {
          label: 'MGNREGA',
          value: '88,420',
        },
        {
          label: 'NFSA',
          value: '83,620',
        },
        {
          label: 'PM-KISAN',
          value: '72,540',
        },
        {
          label: 'Swasthya Sathi',
          value: '68,440',
        },
        {
          label: 'NSAP',
          value: '49,180',
        },
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
        {
          label: 'PM-KISAN',
          value: '1,92,130',
        },
        {
          label: 'NFSA',
          value: '1,70,260',
        },
        {
          label: 'Swasthya Sathi',
          value: '1,26,880',
        },
        {
          label: 'MGNREGA',
          value: '99,710',
        },
        {
          label: 'NSAP',
          value: '74,980',
        },
      ],
      avgSchemesPerCitizen: 2.8,
      zeroSchemePercent: 10.9,
      matchRate: 92.6,
      tone: 'good',
    },
  };

  readonly activeDistrictName = computed(() => {
    const selected = this.selectedDistrict();

    if (selected) {
      return selected;
    }

    const globalDistrict = this.state.filters().district;

    if (globalDistrict && globalDistrict !== 'All districts') {
      return globalDistrict;
    }

    return 'Nadia';
  });

  readonly activeDistrict = computed(() => {
    const districtName = this.activeDistrictName();

    const profile = this.districtProfiles[districtName];

    if (profile) {
      return profile;
    }

    return {
      name: districtName,

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

      tone: 'watch' as const,
    };
  });

  selectDistrict(name: string): void {
    const current = this.selectedDistrict();

    // Clicking the selected district again clears the selection.
    if (current === name) {
      this.selectedDistrict.set(null);

      this.state.update({
        district: 'All districts',
        block: 'All blocks',
      });

      return;
    }

    // Only one district can be selected at a time.
    this.selectedDistrict.set(name);

    this.state.update({
      district: name,
      block: 'All blocks',
    });
  }

  isDistrictSelected(name: string): boolean {
    return this.selectedDistrict() === name;
  }

  clearDistrictSelection(): void {
    this.selectedDistrict.set(null);
    this.hoveredDistrict.set(null);

    this.state.update({
      district: 'All districts',
      block: 'All blocks',
    });
  }

  setHoveredDistrict(name: string): void {
    if (this.hoveredDistrict() !== name) {
      this.hoveredDistrict.set(name);
    }
  }

}
