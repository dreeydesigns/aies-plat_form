export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  thumbnailLink?: string;
  hasThumbnail?: boolean;
  size?: string;
  modifiedTime: string;
  webViewLink: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface SensoryProfile {
  primary: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  pacing: 'fast' | 'medium' | 'slow';
  complexityTolerance: 1 | 2 | 3 | 4 | 5;
  rewardSensitivity: 1 | 2 | 3 | 4 | 5;
  neurodivergentFlags?: {
    adhd: boolean;
    dyslexia: boolean;
    dyscalculia: boolean;
  };
}

export interface SocialPersonality {
  leadershipDrive: 'low' | 'medium' | 'high';
  anxietyTendency: 'low' | 'medium' | 'high';
  collaborationPreference: 'solo' | 'pairs' | 'groups';
  isSquadLeader?: boolean;
}

export interface TransientEmotionalState {
  emotionalValence: 'frustrated' | 'neutral' | 'engaged' | 'euphoric';
  cognitiveLoad: 'low' | 'medium' | 'high';
  flowState: 'bored' | 'flow' | 'anxious' | 'overwhelmed';
  lastEvaluatedAt: string;
}

export interface EmotionalStateLog {
  id?: string;
  studentId: string;
  courseId?: string;
  lessonId?: string;
  emotionalValence: 'frustrated' | 'neutral' | 'engaged' | 'euphoric';
  cognitiveLoad: 'low' | 'medium' | 'high';
  flowState: 'bored' | 'flow' | 'anxious' | 'overwhelmed';
  latencyMs: number;
  retryCount: number;
  timestamp: string;
}

export interface InterventionRecord {
  id?: string;
  studentId: string;
  lessonId: string;
  concept: string;
  interventionType: 'micro_break' | 'analogy_swap' | 'teacher_alert' | 'socratic_hint';
  analogyUsed?: string;
  resolvedState: boolean;
  timestamp: string;
}
