import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { DistrictMapService } from '../../services/district-map.service';
import type { ProjectedDistrict, WestBengalGeoJson } from '../../models/geojson.models';

@Component({
  selector: 'app-district-map',
  standalone: true,
  templateUrl: './district-map.html',
  styleUrl: './district-map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictMapComponent {
  readonly selectedDistrict = input<string | null>(null);
  readonly districtSelected = output<string>();

  private readonly mapService = inject(DistrictMapService);
  private readonly districtGeoJson = signal<WestBengalGeoJson | null>(null);

  readonly hoveredDistrict = signal<string | null>(null);

  readonly projectedDistricts = computed<ProjectedDistrict[]>(() => {
    const geoJson = this.districtGeoJson();
    return geoJson ? this.mapService.projectDistricts(geoJson) : [];
  });

  constructor() {
    void this.loadMap();
  }

  getDistrictName(item: ProjectedDistrict): string {
    return this.mapService.getDistrictName(item.feature);
  }

  onDistrictEnter(name: string): void {
    if (this.hoveredDistrict() !== name) {
      this.hoveredDistrict.set(name);
    }
  }

  onDistrictLeave(): void {
    this.hoveredDistrict.set(null);
  }

  selectDistrict(name: string): void {
    this.districtSelected.emit(name);
  }

  private async loadMap(): Promise<void> {
    try {
      const geoJson = await this.mapService.loadWestBengalMap();
      this.districtGeoJson.set(geoJson);
    } catch (error) {
      console.error('Unable to load West Bengal GeoJSON:', error);
    }
  }
}
