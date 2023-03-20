export interface Pour {
  id: string;
  name: string;
  age: number;
  proof: number;
  volumeOz: number;
  addedAt: string;
}

export interface Drink {
  id: string;
  volumeOz: number;
  note: string;
  drankAt: string;
}

export interface CompositionEntry {
  name: string;
  percent: number;
  volumeOz: number;
  fill: string;
}

export interface ProofPoint {
  pourNumber: number;
  name: string;
  blendedProof: number;
}

/** A unified timeline entry for display purposes. */
export interface TimelineEntry {
  id: string;
  type: "pour" | "drink";
  date: string;
  volumeOz: number;
  /** Pour-only fields */
  name?: string;
  age?: number;
  proof?: number;
  /** Drink-only fields */
  note?: string;
}

export interface BottleStats {
  pours: Pour[];
  drinks: Drink[];
  timeline: TimelineEntry[];
  totalPours: number;
  totalPoured: number;
  totalDrunk: number;
  remainingOz: number;
  blendedProof: number;
  blendedAbv: number;
  composition: CompositionEntry[];
  proofHistory: ProofPoint[];
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function computeStats(pours: Pour[], drinks: Drink[]): BottleStats {
  const totalPoured = pours.reduce((s, p) => s + p.volumeOz, 0);
  const totalDrunk = drinks.reduce((s, d) => s + d.volumeOz, 0);
  const remainingOz = Math.max(0, totalPoured - totalDrunk);

  if (pours.length === 0) {
    return {
      pours,
      drinks,
      timeline: buildTimeline(pours, drinks),
      totalPours: 0,
      totalPoured: 0,
      totalDrunk: round2(totalDrunk),
      remainingOz: 0,
      blendedProof: 0,
      blendedAbv: 0,
      composition: [],
      proofHistory: [],
    };
  }

  const totalAlcohol = pours.reduce(
    (s, p) => s + (p.proof / 100) * p.volumeOz,
    0,
  );
  // Proof is a ratio -- drawing from the blended bottle doesn't change it
  const blendedProof = (totalAlcohol / totalPoured) * 100;

  // Composition grouped by name (ratios based on what was poured in)
  const volumeByName: Record<string, number> = {};
  for (const p of pours) {
    volumeByName[p.name] = (volumeByName[p.name] ?? 0) + p.volumeOz;
  }
  const composition: CompositionEntry[] = Object.entries(volumeByName)
    .map(([name, oz], i) => ({
      name,
      volumeOz: round2(oz),
      percent: round2((oz / totalPoured) * 100),
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }))
    .sort((a, b) => b.percent - a.percent);

  // Proof history -- running blended proof after each pour
  const proofHistory: ProofPoint[] = [];
  let runningVolume = 0;
  let runningAlcohol = 0;
  for (let i = 0; i < pours.length; i++) {
    runningVolume += pours[i].volumeOz;
    runningAlcohol += (pours[i].proof / 100) * pours[i].volumeOz;
    proofHistory.push({
      pourNumber: i + 1,
      name: pours[i].name,
      blendedProof: round2((runningAlcohol / runningVolume) * 100),
    });
  }

  return {
    pours,
    drinks,
    timeline: buildTimeline(pours, drinks),
    totalPours: pours.length,
    totalPoured: round2(totalPoured),
    totalDrunk: round2(totalDrunk),
    remainingOz: round2(remainingOz),
    blendedProof: round2(blendedProof),
    blendedAbv: round2(blendedProof / 2),
    composition,
    proofHistory,
  };
}

function buildTimeline(pours: Pour[], drinks: Drink[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...pours.map((p) => ({
      id: p.id,
      type: "pour" as const,
      date: p.addedAt,
      volumeOz: p.volumeOz,
      name: p.name,
      age: p.age,
      proof: p.proof,
    })),
    ...drinks.map((d) => ({
      id: d.id,
      type: "drink" as const,
      date: d.drankAt,
      volumeOz: d.volumeOz,
      note: d.note,
    })),
  ];
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return entries;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
