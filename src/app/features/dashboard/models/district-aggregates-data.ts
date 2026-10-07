// Place next to scheme-aggregates-data.ts:
// features/dashboard/models/district-aggregates-data.ts
//
// Geography-focused aggregate for the District & Block detail page.
// All numbers are SAMPLE values, not official data.
// Live source: GROUP BY lgd_district_code / lgd_block_code on your member table.

export const TREND_MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

export interface BlockStat {
  lgdBlockCode: string;
  blockName: string;
  citizens: number;     // COUNT(DISTINCT uid) in the block
  coveragePct: number;  // % of citizens with at least one scheme
  growth: string;       // e.g. '+8.8%' (period-over-period)
  avgSchemes: number;   // average schemes per citizen
}

export interface DistrictMasterAggregate {
  districtName: string;
  lgdDistrictCode: string;
  totalCitizens: number;
  coveragePct: number;
  growth: string;
  blocksCount: number;                 // COUNT(DISTINCT lgd_block_code)
  avgSchemesPerCitizen: number;
  citizensWithNoScheme: number;
  multiSchemeCitizens: number;         // citizens with 2+ schemes
  schemeDepth: { label: string; count: number }[]; // 0 / 1 / 2–3 / 4+ schemes
  monthlyEnrollments: number[];        // one value per TREND_MONTHS entry
  dataQuality: {
    withMobile: number;
    withPan: number;
    withEpic: number;
    dobMismatchCount: number;
    avgConfidenceScore: number;        // 0..1
  };
  blocks: BlockStat[];                 // sample: top blocks, not necessarily all
}

interface Seed {
  name: string;
  lgd: string;
  total: number;
  coverage: number;
  growth: string;
  blocksCount: number;
  avgSchemes: number;
  depth: [number, number, number];     // of covered citizens: 1 scheme, 2–3, 4+ (%, sums to 100)
  trend: number[];
  mobile: number;
  pan: number;
  epic: number;
  dobMismatch: number;
  confidence: number;
  blocks: [string, string, number, number, string, number][]; // code, name, citizens, coverage, growth, avgSchemes
}

function build(s: Seed): DistrictMasterAggregate {
  const c = (p: number) => Math.round((s.total * p) / 100);
  const covered = c(s.coverage);
  const d = (p: number) => Math.round((covered * p) / 100);
  const one = d(s.depth[0]);
  const twoThree = d(s.depth[1]);
  const fourPlus = covered - one - twoThree;
  return {
    districtName: s.name,
    lgdDistrictCode: s.lgd,
    totalCitizens: s.total,
    coveragePct: s.coverage,
    growth: s.growth,
    blocksCount: s.blocksCount,
    avgSchemesPerCitizen: s.avgSchemes,
    citizensWithNoScheme: s.total - covered,
    multiSchemeCitizens: twoThree + fourPlus,
    schemeDepth: [
      { label: 'No scheme', count: s.total - covered },
      { label: '1 scheme', count: one },
      { label: '2–3 schemes', count: twoThree },
      { label: '4+ schemes', count: fourPlus },
    ],
    monthlyEnrollments: s.trend,
    dataQuality: {
      withMobile: c(s.mobile),
      withPan: c(s.pan),
      withEpic: c(s.epic),
      dobMismatchCount: c(s.dobMismatch),
      avgConfidenceScore: s.confidence,
    },
    blocks: s.blocks.map(([lgdBlockCode, blockName, citizens, coveragePct, growth, avgSchemes]) => ({
      lgdBlockCode, blockName, citizens, coveragePct, growth, avgSchemes,
    })),
  };
}

// Keys must match DistrictAnalytics.name exactly.
export const DISTRICT_AGGREGATES: Record<string, DistrictMasterAggregate> = {
  'Kolkata': build({
    name: 'Kolkata', lgd: '303', total: 480250, coverage: 97.8, growth: '+12.1%', blocksCount: 15,
    avgSchemes: 3.2, depth: [22, 48, 30], trend: [3100, 3250, 3380, 3520, 3690, 3870],
    mobile: 91, pan: 68, epic: 84, dobMismatch: 3, confidence: 0.94,
    blocks: [
      ['3030101', 'Borough 1', 52800, 99.1, '+13.2%', 3.4],
      ['3030102', 'Borough 2', 44100, 98.6, '+12.5%', 3.3],
      ['3030103', 'Borough 3', 41300, 98.0, '+11.8%', 3.2],
      ['3030104', 'Borough 4', 38900, 97.2, '+12.9%', 3.1],
      ['3030105', 'Borough 5', 36500, 96.4, '+10.7%', 3.0],
      ['3030106', 'Borough 6', 31200, 95.1, '+9.4%', 2.9],
    ],
  }),
  'Nadia': build({
    name: 'Nadia', lgd: '325', total: 570480, coverage: 96.7, growth: '+9.8%', blocksCount: 17,
    avgSchemes: 2.7, depth: [28, 50, 22], trend: [3600, 3700, 3820, 3900, 4010, 4120],
    mobile: 86, pan: 54, epic: 80, dobMismatch: 5, confidence: 0.91,
    blocks: [
      ['3250101', 'Krishnanagar-I', 51200, 98.4, '+10.9%', 2.9],
      ['3250102', 'Ranaghat-I', 46800, 97.5, '+10.2%', 2.8],
      ['3250103', 'Chakdaha', 41900, 96.9, '+9.6%', 2.8],
      ['3250104', 'Haringhata', 35400, 96.1, '+9.1%', 2.7],
      ['3250105', 'Santipur', 34700, 95.2, '+8.4%', 2.6],
      ['3250106', 'Karimpur-I', 29300, 93.8, '+6.9%', 2.5],
    ],
  }),
  'Hooghly': build({
    name: 'Hooghly', lgd: '320', total: 601320, coverage: 94.8, growth: '+7.4%', blocksCount: 18,
    avgSchemes: 2.6, depth: [30, 50, 20], trend: [3800, 3880, 3950, 4010, 4090, 4150],
    mobile: 85, pan: 52, epic: 78, dobMismatch: 5, confidence: 0.9,
    blocks: [
      ['3200101', 'Chinsurah-Mogra', 54300, 97.6, '+8.8%', 2.8],
      ['3200102', 'Serampore-Uttarpara', 50100, 96.8, '+8.1%', 2.7],
      ['3200103', 'Arambagh', 44900, 95.0, '+7.2%', 2.6],
      ['3200104', 'Dhaniakhali', 36200, 93.4, '+6.5%', 2.5],
      ['3200105', 'Pursurah', 30800, 91.7, '+5.9%', 2.4],
      ['3200106', 'Goghat-I', 26500, 89.3, '+4.1%', 2.3],
    ],
  }),
  'North 24 Parganas': build({
    name: 'North 24 Parganas', lgd: '328', total: 640915, coverage: 92.6, growth: 'N/A', blocksCount: 22,
    avgSchemes: 2.5, depth: [32, 50, 18], trend: [4000, 4060, 4100, 4140, 4190, 4230],
    mobile: 83, pan: 50, epic: 76, dobMismatch: 6, confidence: 0.89,
    blocks: [
      ['3280101', 'Barasat-I', 51300, 96.2, '+7.5%', 2.7],
      ['3280102', 'Basirhat-I', 47600, 94.8, '+6.9%', 2.6],
      ['3280103', 'Barrackpore-I', 45900, 93.9, '+6.4%', 2.6],
      ['3280104', 'Bongaon', 40200, 92.1, '+5.8%', 2.5],
      ['3280105', 'Habra-I', 36700, 90.4, '+4.7%', 2.4],
      ['3280106', 'Sandeshkhali-I', 27100, 84.6, '+1.9%', 2.1],
    ],
  }),
  'Malda': build({
    name: 'Malda', lgd: '322', total: 410760, coverage: 74.5, growth: '-3.4%', blocksCount: 15,
    avgSchemes: 1.9, depth: [45, 43, 12], trend: [2900, 2850, 2780, 2720, 2690, 2640],
    mobile: 78, pan: 41, epic: 70, dobMismatch: 9, confidence: 0.84,
    blocks: [
      ['3220101', 'English Bazar', 41200, 86.3, '+1.2%', 2.3],
      ['3220102', 'Manikchak', 33800, 70.2, '-4.8%', 1.9],
      ['3220103', 'Kaliachak-I', 35100, 76.4, '-2.9%', 2.0],
      ['3220104', 'Harishchandrapur-I', 28600, 72.8, '-4.1%', 1.9],
      ['3220105', 'Ratua-I', 26900, 68.5, '-6.3%', 1.7],
      ['3220106', 'Gazole', 30400, 78.9, '-1.5%', 2.0],
    ],
  }),
  'Purulia': build({
    name: 'Purulia', lgd: '331', total: 430125, coverage: 71.2, growth: '-5.8%', blocksCount: 20,
    avgSchemes: 1.7, depth: [50, 40, 10], trend: [2700, 2640, 2590, 2520, 2470, 2400],
    mobile: 74, pan: 38, epic: 66, dobMismatch: 11, confidence: 0.81,
    blocks: [
      ['3310101', 'Purulia-I', 36400, 82.5, '-0.8%', 2.1],
      ['3310102', 'Raghunathpur-I', 31700, 75.9, '-3.6%', 1.9],
      ['3310103', 'Jhalda-I', 29800, 69.4, '-6.2%', 1.7],
      ['3310104', 'Balarampur', 27300, 64.8, '-9.1%', 1.5],
      ['3310105', 'Manbazar-I', 25600, 68.1, '-7.4%', 1.6],
      ['3310106', 'Bandwan', 22900, 62.3, '-8.6%', 1.4],
    ],
  }),
};