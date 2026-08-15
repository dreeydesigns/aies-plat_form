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

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface CognitiveProfile {
  workingMemory: 'standard' | 'high' | 'extended';
  processingSpeed: 'standard' | 'rapid' | 'deliberate';
  patternRecognition: 'standard' | 'high' | 'expert';
  attentionSpanMinutes?: number;
}

export interface UserProfile {
  uid: string;
  id?: string;
  displayName: string | null;
  name?: string;
  email: string | null;
  photoURL: string | null;
  avatar?: string;
  role: UserRole;
  dateOfBirth?: string;
  linkedParentUid?: string;          // student only
  linkedStudentUids?: string[];      // parent only
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  targetTestDate?: string;
  targetScore?: number;
  baselineScore?: number;
  points?: number;
  level?: number;
  streak?: number;
  linkCode?: string;
  completedLessons?: string[];
  earnedBadges?: string[];
  satProfile?: SatProfile;
  cognitiveProfile?: CognitiveProfile;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// AIES SAT SPECIFICATION V3 DATA MODEL
// ==========================================

export type SatSubject = 'math' | 'rw' | 'full';

export type SatDomain = 
  | 'algebra'
  | 'advanced-math'
  | 'problem-solving-data-analysis'
  | 'geometry-trigonometry'
  | 'information-ideas'
  | 'craft-structure'
  | 'expression-of-ideas'
  | 'standard-english-conventions';

export type SatDifficulty = 'easy' | 'medium' | 'hard';

export interface SatQuestionV3 {
  id: string;
  subject: 'math' | 'rw';
  domain: string;                   // e.g. "Algebra", "Standard English Conventions"
  skill: string;                    // e.g. "Linear equations in one variable"
  difficulty: SatDifficulty;
  stem: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctChoice: 'A' | 'B' | 'C' | 'D';
  isSPR?: boolean;                  // Student-Produced Response (Math grid-in)
  explanation: string;
  sourceTextbookId?: string;
  sourcePage?: number;
  sourceLineRef?: string;
  generatedBy: 'human' | 'ai';
  generatedFromPrompt?: string;
  createdAt?: string;
}

// Backwards compatibility alias
export interface SatQuestion extends Partial<SatQuestionV3> {
  id: string;
  section?: 'math' | 'reading-writing';
  domain: any;
  skill: string;
  difficulty: any;
  questionText: string;
  options: string[];
  correctAnswer: number | string;
  isSPR?: boolean;
  explanation: string;
  textbookRef?: {
    textbookId: string;
    page: number;
    highlightedText: string;
  };
  sourceTextbookId?: string;
  sourcePage?: number;
  sourceLineRef?: string;
  createdAt?: string;
  createdBy?: string;
  stats?: {
    attempts: number;
    correct: number;
  };
}

export interface AttemptResponse {
  questionId: string;
  selectedChoice?: string;          // "A" | "B" | "C" | "D" or numeric string
  isCorrect?: boolean;
  timeToAnswerMs: number;
  revisitCount: number;
  markedForReview: boolean;
  crossedOutChoices: string[];      // ["A", "C"]
}

export interface SatAttempt {
  id?: string;
  attemptId?: string;
  studentUid: string;
  mode: 'trial' | 'topic_practice' | 'full_practice' | 'official';
  subject: 'math' | 'rw' | 'full';
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  startedAt: string;
  lastSavedAt: string;
  completedAt?: string;
  responses: AttemptResponse[];
  totalScaledScore?: number;
  mathScaledScore?: number;
  rwScaledScore?: number;
}

export interface TextbookWorkedExample {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problem: string;
  solution: string;
  trap?: string;
}

export interface TextbookRelatedTopic {
  title: string;
  textbookId: string;
  chapterId?: string;
  sectionId?: string;
  pageNumber?: number;
  domain: string;
}

export interface TextbookSection {
  id: string;
  sectionNumber: string; // e.g. "1.1", "2.3"
  title: string;          // e.g. "Words in Context: High-Frequency Vocabulary"
  skill: string;          // e.g. "Words in Context"
  pageNumber: number;     // e.g. 1
  conceptSummary: string; // Core theory & pedagogical foundation
  methodSteps: string[];  // Step 1, Step 2, Step 3
  workedExamples: TextbookWorkedExample[];
  commonMistakes: string[];
  featuredQuestionId?: string;
  similarQuestionIds?: string[];
  relatedTopics?: TextbookRelatedTopic[];
}

export interface TextbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  domain: SatDomain;
  description: string;
  sections: TextbookSection[];
}

export interface TextbookChangelogEntry {
  id: string;
  date: string;
  summary: string;
  triggerExamTitle?: string;
  teacherName?: string;
  approvedBy?: string;
  sectionsAdded: number;
}

export interface TextbookPage {
  pageNumber: number;
  content: string;
  ocrText?: string;
  sections: Array<{ heading: string; text: string }>;
}

export interface Textbook {
  id: string;
  title: string;
  subject: 'math' | 'reading-writing';
  author: string;
  publisherOrOwner: string;
  coverColor: string;
  description?: string;
  version?: string;
  lastUpdated?: string;
  changelog?: TextbookChangelogEntry[];
  chapters?: TextbookChapter[];
  pages: TextbookPage[];
}

export interface NotificationItem {
  id: string;
  toUid: string;
  type: 'test_assigned' | 'report_ready';
  payload: {
    testId?: string;
    title?: string;
    assignedBy?: string;
    dueDate?: string;
    score?: number;
    url?: string;
  };
  read: boolean;
  createdAt: string;
}

export interface AssignedTest {
  id: string;
  assignedByTeacherId: string;
  assignedByTeacherName?: string;
  assignedToUserIds: string[];
  testConfig: {
    section: 'math' | 'reading-writing';
    domain?: SatDomain;
    difficultyTarget?: 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'expert';
  };
  notificationSent: boolean;
  dueDate?: string;
  createdAt: string;
  completedBy?: string[];
}

export interface SatProfile {
  diagnosticCompleted?: boolean;
  targetScore?: number;
  targetTestDate?: string;
  baselineScore?: number;
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  placementByDomain?: Partial<Record<SatDomain, 'beginner' | 'intermediate' | 'expert'>>;
  consecutiveHardCorrect?: {
    math: number;
    rw: number;
  };
  practiceHistory?: Array<{
    domain: SatDomain;
    difficulty: string;
    correct: boolean;
    timestamp: string;
  }>;
}

export interface SatDiagnosticSession {
  id: string;
  userId: string;
  section: 'math' | 'reading-writing';
  module1Questions?: string[];
  module2Questions?: string[];
  module2Difficulty?: 'easy' | 'standard' | 'hard';
  moduleResults: Array<{
    questionId: string;
    correct: boolean;
    timeSeconds: number;
    revisited: boolean;
    bookmarked?: boolean;
    fiveFinger?: boolean;
    fiveFingerReason?: 'too-slow' | 'between-two' | 'dont-know' | 'trap-answer' | 'other';
    selectedOption?: number;
    chosenAnswer?: number | string;
  }>;
  placementByDomain: Record<SatDomain, 'beginner' | 'intermediate' | 'expert'>;
  aiSummary?: string;
  completedAt: string;
}

export interface SatPracticeSession {
  id: string;
  userId: string;
  mode: 'mixed' | 'topic';
  domain?: SatDomain;
  questions: string[];
  answers: Array<{
    questionId: string;
    selected: number | string;
    correct: boolean;
    timeSeconds: number;
    revisited: boolean;
    bookmarked?: boolean;
    fiveFinger?: boolean;
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
    module: 1 | 2;
    questions: string[];
    timeLimitSeconds: number;
    startedAt?: string;
    submittedAt?: string;
    rawScore?: number;
    estimatedScaledScore?: number;
    answers?: Record<string, { selected: number | string; flagged?: boolean; timeSeconds?: number; fiveFinger?: boolean; fiveFingerReason?: string }>;
  }>;
  totalEstimatedScore?: number;
  completedAt?: string;
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

export interface FiveFingerLog {
  id: string;
  userId: string;
  sessionId: string;
  module: 1 | 2;
  fingers: Array<{
    questionId: string;
    reason: string;
    wasCorrect: boolean;
    timeSeconds: number;
  }>;
  extraFingers?: Array<{ questionId: string; reason: string }>;
  createdAt: string;
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
