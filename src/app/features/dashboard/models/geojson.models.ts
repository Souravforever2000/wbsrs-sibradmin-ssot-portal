export type DistrictProperties = {
  name?: string;
  NAME?: string;
  NAME_2?: string;
  District?: string;
  district?: string;
  DISTRICT?: string;
  dtname?: string;
  DTNAME?: string;
  stname?: string;
  STNAME?: string;
};

export type DistrictFeature = {
  type: 'Feature';
  properties: DistrictProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
};

export type WestBengalGeoJson = {
  type: 'FeatureCollection';
  features: DistrictFeature[];
};

export type MapBounds = {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
};

export type ProjectedDistrict = {
  feature: DistrictFeature;
  paths: string[];
};
