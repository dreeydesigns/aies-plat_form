/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Calculates the next optimal review interval based on student recall performance.
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

export function scoreToSM2Quality(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  if (score >= 20) return 1;
  return 0;
}
