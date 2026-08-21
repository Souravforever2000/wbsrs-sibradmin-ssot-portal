export type DistrictMetric = {
  label: string;
  value: string;
};

export type DistrictAnalytics = {
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
