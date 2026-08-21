import { Injectable } from '@angular/core';

import type {
  DistrictFeature,
  MapBounds,
  ProjectedDistrict,
  WestBengalGeoJson,
} from '../models/geojson.models';

@Injectable({ providedIn: 'root' })
export class DistrictMapService {
  private readonly mapWidth = 700;
  private readonly mapHeight = 520;
  private readonly mapPadding = 20;

  async loadWestBengalMap(): Promise<WestBengalGeoJson> {
    const response = await fetch('assets/maps/west-bengal.geojson');

    if (!response.ok) {
      throw new Error(`Failed to load west-bengal.geojson: ${response.status}`);
    }

    const geoJson = (await response.json()) as WestBengalGeoJson;

    if (geoJson.type !== 'FeatureCollection' || !Array.isArray(geoJson.features)) {
      throw new Error('Invalid West Bengal GeoJSON format.');
    }

    return geoJson;
  }

  projectDistricts(geoJson: WestBengalGeoJson): ProjectedDistrict[] {
    if (!geoJson.features.length) {
      return [];
    }

    const bounds = this.calculateBounds(geoJson.features);

    return geoJson.features.map((feature) => ({
      feature,
      paths: this.geometryToSvgPaths(feature.geometry, bounds),
    }));
  }

  getDistrictName(feature: DistrictFeature): string {
    const properties = feature.properties;
    const rawName =
      properties.district ??
      properties.DISTRICT ??
      properties.District ??
      properties.NAME_2 ??
      properties.name ??
      properties.NAME ??
      properties.dtname ??
      properties.DTNAME;

    if (typeof rawName !== 'string') {
      return 'Unknown District';
    }

    return rawName.trim().replace(/\s+/g, ' ');
  }

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

    return { minLon, maxLon, minLat, maxLat };
  }

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

  private projectCoordinate(
    coordinate: [number, number],
    bounds: MapBounds,
  ): [number, number] {
    const { minLon, maxLon, minLat, maxLat } = bounds;
    const longitudeRange = maxLon - minLon || 1;
    const latitudeRange = maxLat - minLat || 1;
    const availableWidth = this.mapWidth - this.mapPadding * 2;
    const availableHeight = this.mapHeight - this.mapPadding * 2;
    const scale = Math.min(availableWidth / longitudeRange, availableHeight / latitudeRange);
    const actualWidth = longitudeRange * scale;
    const actualHeight = latitudeRange * scale;
    const offsetX = (this.mapWidth - actualWidth) / 2;
    const offsetY = (this.mapHeight - actualHeight) / 2;
    const x = offsetX + (coordinate[0] - minLon) * scale;
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

  private geometryToSvgPaths(
    geometry: DistrictFeature['geometry'],
    bounds: MapBounds,
  ): string[] {
    if (geometry.type === 'Polygon') {
      const polygon = geometry.coordinates as number[][][];
      return polygon.map((ring) => this.ringToSvgPath(ring, bounds)).filter(Boolean);
    }

    const multiPolygon = geometry.coordinates as number[][][][];
    return multiPolygon.flatMap((polygon) =>
      polygon.map((ring) => this.ringToSvgPath(ring, bounds)).filter(Boolean),
    );
  }
}
