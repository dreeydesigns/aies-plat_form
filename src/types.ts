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

// ==========================================
// AIES SAT PLATFORM TYPES
// ==========================================

export type SatDomain = 
  | 'algebra'
  | 'advanced-math'
  | 'problem-solving-data-analysis'
  | 'geometry-trigonometry'
  | 'information-ideas'
  | 'craft-structure'
  | 'expression-of-ideas'
  | 'standard-english-conventions';

export interface SatQuestion {
  id: string;
  section: 'math' | 'reading-writing';
  domain: SatDomain;
  skill: string;               // e.g., "linear equations in one variable"
  difficulty: 'beginner' | 'intermediate' | 'expert';
  questionText: string;
  options: string[];           // 4 options
  correctAnswer: number;       // index into options (0-3)
  explanation: string;
  textbookRef?: {
    textbookId: string;
    page: number;
    highlightedText: string;   // exact snippet
  };
  createdAt: string;
  createdBy: string;           // teacher/admin uid
}

export interface SatDiagnosticSession {
  id: string;
  userId: string;
  section: 'math' | 'reading-writing';
  moduleResults: Array<{
    questionId: string;
    correct: boolean;
    timeSeconds: number;
    revisited: boolean;       // true if student went back after moving on
    selectedOption?: number;
  }>;
  placementByDomain: Record<SatDomain, 'beginner' | 'intermediate' | 'expert'>;
  aiSummary?: string;
  completedAt: string;
}

export interface SatPracticeSession {
  id: string;
  userId: string;
  mode: 'mixed' | 'topic';     // mixed = all domains, topic = specific domain
  domain?: SatDomain;          // if mode = topic
  questions: string[];         // question IDs
  answers: Array<{
    questionId: string;
    selected: number;
    correct: boolean;
    timeSeconds: number;
    revisited: boolean;
  }>;
  startedAt: string;
  completedAt?: string;
  promotedDomain?: SatDomain;
}

export interface SatPracticeTest {
  id: string;
  userId: string;
  mode: 'math' | 'english' | 'full';
  sections: Array<{
    section: 'math' | 'reading-writing';
    module: number;            // 1 or 2
    questions: string[];
    timeLimitSeconds: number;
    startedAt?: string;
    submittedAt?: string;
    rawScore?: number;
    estimatedScaledScore?: number;
    answers?: Record<string, { selected: number; flagged?: boolean; timeSeconds?: number }>;
  }>;
  totalEstimatedScore?: number;
  completedAt?: string;
}

export interface TextbookPage {
  pageNumber: number;
  content: string;
  sections: Array<{ heading: string; text: string }>;
}

export interface Textbook {
  id: string;
  title: string;
  author: string;
  publisherOrOwner: string;
  coverColor: string;
  pages: TextbookPage[];
}

export interface AssignedTest {
  id: string;
  assignedByTeacherId: string;
  assignedByTeacherName?: string;
  assignedToUserIds: string[];
  testConfig: {
    section: 'math' | 'reading-writing';
    domain?: SatDomain;        // optional, if all topics
    difficultyTarget?: 'beginner' | 'intermediate' | 'expert';
  };
  notificationSent: boolean;
  dueDate?: string;
  createdAt: string;
  completedBy?: string[];
}

export interface CognitiveProfile {
  primaryLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  pacing: 'fast' | 'medium' | 'slow';
  anxietyTendency: 'low' | 'medium' | 'high';
  neurodivergentFlags?: {
    adhd: boolean;
    dyslexia: boolean;
    dyscalculia: boolean;
  };
}

export interface SatProfile {
  diagnosticCompleted?: boolean;
  placementByDomain?: Partial<Record<SatDomain, 'beginner' | 'intermediate' | 'expert'>>;
  practiceHistory?: Array<{
    domain: SatDomain;
    difficulty: string;
    correct: boolean;
    timestamp: string;
  }>;
}

export interface EmotionalStateLog {
  id?: string;
  userId?: string;
  studentId?: string;
  sessionId?: string;
  courseId?: string;
  lessonId?: string;
  cognitiveLoad: 'low' | 'medium' | 'high';
  emotionalValence: 'frustrated' | 'neutral' | 'engaged' | 'euphoric';
  flowState: 'bored' | 'challenge' | 'match' | 'overwhelmed' | 'flow' | 'anxious';
  latencyMs?: number;
  retryCount?: number;
  timestamp: string;
}
