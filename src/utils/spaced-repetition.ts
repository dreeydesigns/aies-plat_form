/**
 * SuperMemo SM-2 Spaced Repetition Algorithm 2.0
 * Calculates the next optimal review interval based on student recall performance & response latency confidence.
 */

export interface ReviewScheduleItem {
  id: string;
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewScore: number;
  lastLatencyMs?: number;
  nextReviewDate: string; // ISO string
}

export function calculateSM2NextReview(
  quality: number, // 0 to 5 scale
  currentRepetition: number = 0,
  currentInterval: number = 1,
  currentEaseFactor: number = 2.5
): { repetitionCount: number; intervalDays: number; easeFactor: number; nextReviewDate: string } {
  let q = Math.max(0, Math.min(5, quality));

  let easeFactor = currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  let repetitionCount = currentRepetition;
  let intervalDays = currentInterval;

  if (q >= 3) {
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(currentInterval * easeFactor);
    }
    repetitionCount += 1;
  } else {
    repetitionCount = 0;
    intervalDays = 1;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    repetitionCount,
    intervalDays,
    easeFactor: Math.round(easeFactor * 100) / 100,
    nextReviewDate: nextDate.toISOString(),
  };
}

/**
 * Converts accuracy score AND response latency confidence into SM-2 quality (0 to 5).
 */
export function scoreToSM2Quality(score: number, latencyMs?: number): number {
  let q = 0;
  if (score >= 90) q = 5;
  else if (score >= 75) q = 4;
  else if (score >= 60) q = 3;
  else if (score >= 40) q = 2;
  else if (score >= 20) q = 1;
  else q = 0;

  // Latency confidence adjustment:
  // Long latency (>25s) indicates hesitant recall -> dock 1 quality point
  if (latencyMs && latencyMs > 25000 && q > 1) {
    q -= 1;
  }
  return q;
}
