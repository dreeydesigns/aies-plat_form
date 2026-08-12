import { TransientEmotionalState } from '../types';

export interface EvaluationInput {
  latencyMs: number;
  expectedMs?: number;
  isCorrect: boolean;
  retryCount: number;
  recentScoreAvg?: number; // 0..100
}

/**
 * Calculates transient emotional valence, cognitive load, and flow state
 * based on non-invasive behavioral proxies (latency, retry frequency, accuracy).
 */
export function evaluateEmotionalState(input: EvaluationInput): TransientEmotionalState {
  const { latencyMs, expectedMs = 15000, isCorrect, retryCount, recentScoreAvg = 70 } = input;
  
  let cognitiveLoad: 'low' | 'medium' | 'high' = 'medium';
  let emotionalValence: 'frustrated' | 'neutral' | 'engaged' | 'euphoric' = 'neutral';
  let flowState: 'bored' | 'flow' | 'anxious' | 'overwhelmed' = 'flow';

  const latencyRatio = latencyMs / expectedMs;

  // Evaluate Cognitive Load
  if (latencyRatio > 2.0 || retryCount >= 3) {
    cognitiveLoad = 'high';
  } else if (latencyRatio < 0.5 && isCorrect) {
    cognitiveLoad = 'low';
  } else {
    cognitiveLoad = 'medium';
  }

  // Evaluate Flow State & Emotional Valence
  if (isCorrect && latencyRatio < 0.4) {
    flowState = 'bored';
    emotionalValence = 'neutral';
  } else if (isCorrect && latencyRatio >= 0.4 && latencyRatio <= 1.8) {
    flowState = 'flow';
    emotionalValence = recentScoreAvg > 85 ? 'euphoric' : 'engaged';
  } else if (!isCorrect && retryCount >= 2 && latencyRatio > 1.5) {
    flowState = 'overwhelmed';
    emotionalValence = 'frustrated';
  } else if (!isCorrect && latencyRatio > 1.8) {
    flowState = 'anxious';
    emotionalValence = 'frustrated';
  } else if (!isCorrect) {
    flowState = 'anxious';
    emotionalValence = 'neutral';
  }

  return {
    emotionalValence,
    cognitiveLoad,
    flowState,
    lastEvaluatedAt: new Date().toISOString()
  };
}
