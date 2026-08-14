import scoreTables from '../data/scoreConversionTables.json';

export const SAT_DISCLAIMER = "SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, this product. Scores provided are estimated scaled approximations based on official concordance tables.";

export function calculateScaledScore(section: 'math' | 'reading-writing' | 'rw', rawScore: number, totalQuestions: number): number {
  const isMath = section === 'math';
  const table = isMath ? scoreTables.math : scoreTables.rw;
  const officialTotal = table.totalQuestions;

  // Scale rawScore proportionally to the official standard module item count
  const normalizedRaw = Math.round((rawScore / Math.max(1, totalQuestions)) * officialTotal);
  const clampedRaw = Math.max(0, Math.min(officialTotal, normalizedRaw));

  const conv = table.conversion as Record<string, number>;
  if (conv[String(clampedRaw)] !== undefined) {
    return conv[String(clampedRaw)];
  }

  // Linear fallback if intermediate key is not explicitly tabulated
  const pct = clampedRaw / officialTotal;
  return Math.round(200 + pct * 600);
}

export function calculateTotalScore(mathScaled: number, rwScaled: number): number {
  return Math.max(400, Math.min(1600, (mathScaled || 200) + (rwScaled || 200)));
}
