// SAT Score Concordance Table & Estimator
// Based on public College Board Digital SAT raw-to-scaled score conversion models.

export const SAT_DISCLAIMER = 'Estimated score based on public concordance data. Not official.';

// Mapping raw score (out of 44 for Math, out of 54 for Reading & Writing) to 200-800 scaled score
const mathConcordance: Record<number, number> = {
  0: 200, 1: 210, 2: 230, 3: 250, 4: 270, 5: 290, 6: 310, 7: 330, 8: 350,
  9: 370, 10: 390, 11: 410, 12: 430, 13: 450, 14: 470, 15: 490, 16: 510,
  17: 520, 18: 540, 19: 550, 20: 570, 21: 580, 22: 600, 23: 610, 24: 630,
  25: 640, 26: 660, 27: 670, 28: 690, 29: 700, 30: 710, 31: 720, 32: 730,
  33: 740, 34: 750, 35: 760, 36: 770, 37: 780, 38: 790, 39: 790, 40: 800,
  41: 800, 42: 800, 43: 800, 44: 800
};

const readingWritingConcordance: Record<number, number> = {
  0: 200, 1: 210, 2: 220, 3: 240, 4: 260, 5: 280, 6: 300, 7: 320, 8: 340,
  9: 360, 10: 370, 11: 390, 12: 410, 13: 420, 14: 440, 15: 450, 16: 470,
  17: 480, 18: 500, 19: 510, 20: 520, 21: 540, 22: 550, 23: 560, 24: 580,
  25: 590, 26: 600, 27: 610, 28: 620, 29: 630, 30: 640, 31: 650, 32: 660,
  33: 670, 34: 680, 35: 690, 36: 700, 37: 710, 38: 720, 39: 730, 40: 740,
  41: 750, 42: 760, 43: 770, 44: 770, 45: 780, 46: 780, 47: 790, 48: 790,
  49: 800, 50: 800, 51: 800, 52: 800, 53: 800, 54: 800
};

export function calculateScaledScore(section: 'math' | 'reading-writing', rawScore: number, totalQuestions?: number): number {
  if (section === 'math') {
    // Normalize if total questions differs from 44
    const maxRaw = 44;
    const effectiveRaw = totalQuestions && totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * maxRaw) : rawScore;
    const clamped = Math.max(0, Math.min(maxRaw, effectiveRaw));
    return mathConcordance[clamped] || 200;
  } else {
    const maxRaw = 54;
    const effectiveRaw = totalQuestions && totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * maxRaw) : rawScore;
    const clamped = Math.max(0, Math.min(maxRaw, effectiveRaw));
    return readingWritingConcordance[clamped] || 200;
  }
}

export function calculateTotalScore(mathScaled: number, rwScaled: number): number {
  return Math.min(1600, Math.max(400, mathScaled + rwScaled));
}
