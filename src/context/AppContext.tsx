import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkBadges } from '../utils/badge-manager';
import { initAuth, db } from '../lib/firebase';
import { collection, doc, getDoc, updateDoc, setDoc, addDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { 
  useFirestoreUsers, 
  useFirestoreCourses, 
  useFirestoreSubmissions, 
  useFirestoreRetakePrompts, 
  useFirestoreAgentEvents, 
  useFirestoreMisconceptionCases,
  useFirestoreSatQuestions,
  useFirestoreAssignedTests,
  useFirestoreSatDiagnostics,
  useFirestoreSatPractices,
  useFirestoreSatTests
} from '../hooks/useFirestore';
import { User as FirebaseAuthUser } from 'firebase/auth';

import { 
  SensoryProfile, 
  SocialPersonality, 
  TransientEmotionalState, 
  EmotionalStateLog, 
  InterventionRecord,
  SatDomain,
  SatQuestion,
  SatDiagnosticSession,
  SatPracticeSession,
  SatPracticeTest,
  AssignedTest,
  CognitiveProfile,
  SatProfile,
  Textbook
} from '../types';

export type Role = 'student' | 'teacher' | 'parent' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  grade?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  age?: number;
  parentId?: string | null;
  linkedParentUid?: string;          // student only
  linkedStudentUids?: string[];      // parent only
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  targetTestDate?: string;
  targetScore?: number;
  baselineScore?: number;
  isParentManaged?: boolean;
  sensoryProfile?: SensoryProfile;
  socialPersonality?: SocialPersonality;
  transientEmotionalState?: TransientEmotionalState;
  cognitiveProfile?: CognitiveProfile;
  satProfile?: SatProfile;
  consent?: {
    deviceSync: boolean;
    cameraWellness: boolean;
    whatsappNotifications: boolean;
    updatedAt: string;
    parentApproved?: boolean;
  };
  institutionId?: string;
  avatar?: string;
  photoURL?: string;
  points?: number;
  level?: number;
  streak?: number;
  childIds?: string[];
  parentIds?: string[];
  linkCode?: string;
  completedLessons?: string[];
  earnedBadges?: string[];
  learningRecords?: Array<{ lessonId: string; completedAt: string; quizScore?: number }>;
  teacherReport?: { strengths: string; supportNeeds: string; remarks: string; updatedAt: string };
  createdAt?: string;
  updatedAt?: string;
}

export function computeAge(dob: string): number {
  if (!dob) return 18;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'reading' | 'quiz' | 'vr';
  quizId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizzes?: Record<string, Quiz>;
  sourceDocument?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface DetailedQuestionResult {
  id: string;
  text: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  lessonId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<string, number>;
  questionDetails: DetailedQuestionResult[];
  adaptivePath: 'remedial' | 'standard' | 'advanced';
  pointsEarned: number;
  submittedAt: string;
  attemptNumber?: number;
  retakeStatus?: 'none' | 'prompted' | 'completed';
  retakeNote?: string;
  teacherFeedback?: string;
}

export interface RetakePrompt {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  type: 'quiz' | 'lesson' | 'course';
  targetId: string; // quizId, lessonId, or courseId
  courseId?: string;
  lessonId?: string;
  targetTitle: string;
  note?: string;
  createdAt: string;
  status: 'pending' | 'completed';
}

export interface AgentEvent {
  id: string;
  type: 'misconception_flagged' | 'remediation_attempted' | 'outcome_logged' | 'question_asked' | 'tutor_response';
  studentId: string;
  studentName?: string;
  payload: Record<string, any>;
  producedBy: 'orchestrator' | 'tutor' | 'diagnostician' | 'pedagogyResearch' | 'contentCurator' | 'grading';
  consumedBy?: string[];
  confidenceScore?: number; // 0.0 to 1.0
  createdAt: string;
}

export interface MisconceptionCase {
  id: string;
  concept: string;
  subject: string;
  gradeLevel: string;
  misconceptionDescription: string;
  remediationsAttempted: Array<{
    strategy: string;
    attempts: number;
    successCount: number;
  }>;
  updatedAt: string;
}

export interface AppContextType {
  currentUser: FirebaseAuthUser | null;
  setCurrentUser: (user: FirebaseAuthUser | null) => void;
  userProfile: User | null;
  setUserProfile: (profile: User | null) => void;
  allUsers: User[];
  linkedStudents: User[];
  loading: boolean;
  linkChild: (parentUid: string, studentLinkCode: string) => Promise<void>;
  unlinkChild: (parentUid: string, childUid: string) => Promise<void>;
  isAuthReady: boolean;
  users: User[];
  courses: Course[];
  quizzes: Record<string, Quiz>;
  completedLessons: string[];
  completeLesson: (lessonId: string, pointsEarned: number, quizScore?: number) => void;
  earnedBadges: string[];
  awardBadge: (badgeId: string) => void;
  leaderboard: User[];
  messages: any[];
  addLesson: (courseId: string, lesson: Lesson) => void;
  addQuiz: (quizId: string, quiz: Quiz) => void;
  submissions: QuizSubmission[];
  retakePrompts: RetakePrompt[];
  agentEvents: AgentEvent[];
  misconceptionCases: MisconceptionCase[];
  isMinor: boolean;
  canAccessSettings: boolean;
  canAccessVR: boolean;
  saveQuizSubmission: (submission: Omit<QuizSubmission, 'id'>) => Promise<string>;
  promptRetake: (prompt: Omit<RetakePrompt, 'id'>) => Promise<void>;
  updateSubmissionFeedback: (submissionId: string, teacherFeedback: string) => Promise<void>;
  markRetakeCompleted: (promptId: string) => Promise<void>;
  logAgentEvent: (event: Omit<AgentEvent, 'id'>) => Promise<string>;
  saveMisconceptionCase: (c: Omit<MisconceptionCase, 'id'>) => Promise<string>;
  logEmotionalState: (log: EmotionalStateLog) => Promise<string>;
  saveInterventionRecord: (record: InterventionRecord) => Promise<string>;

  // SAT Platform methods
  satQuestions: SatQuestion[];
  assignedTests: AssignedTest[];
  satDiagnostics: SatDiagnosticSession[];
  satPractices: SatPracticeSession[];
  satTests: SatPracticeTest[];
  saveSatDiagnosticSession: (session: Omit<SatDiagnosticSession, 'id'>) => Promise<string>;
  saveSatPracticeSession: (session: Omit<SatPracticeSession, 'id'>) => Promise<string>;
  saveSatPracticeTest: (test: Omit<SatPracticeTest, 'id'>) => Promise<string>;
  assignSatTest: (assignment: Omit<AssignedTest, 'id'>) => Promise<string>;
  updateSatPlacement: (domain: SatDomain, level: 'beginner' | 'intermediate' | 'expert') => Promise<void>;
  recordSkillAttempt: (skill: string, domain: SatDomain, correct: boolean, paceSeconds: number, difficulty: string) => Promise<void>;
  recordTextbookFollowThrough: (skill: string, domain: SatDomain, reattemptCorrect?: boolean) => Promise<void>;
  updateCognitiveProfile: (profile: Partial<CognitiveProfile>) => Promise<void>;
  updateConsent: (consent: Partial<NonNullable<User['consent']>>) => Promise<void>;
}

const mockQuizzes: Record<string, Quiz> = {
  'q1': {
    id: 'q1',
    title: 'Cell Structure Quiz',
    questions: [
      { id: 'qq1', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correctAnswer: 1 },
      { id: 'qq2', text: 'Which organelle contains the genetic material?', options: ['Nucleus', 'Golgi Apparatus', 'Lysosome', 'Chloroplast'], correctAnswer: 0 }
    ]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const completedLessons = userProfile?.completedLessons || [];
  const earnedBadges = userProfile?.earnedBadges || [];
  
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>(mockQuizzes);
  
  const users = useFirestoreUsers(!!currentUser);
  const courses = useFirestoreCourses(!!currentUser);
  const submissions = useFirestoreSubmissions(!!currentUser);
  const retakePrompts = useFirestoreRetakePrompts(!!currentUser);
  const agentEvents = useFirestoreAgentEvents(!!currentUser);
  const misconceptionCases = useFirestoreMisconceptionCases(!!currentUser);

  // SAT Subscriptions
  const satQuestions = useFirestoreSatQuestions(!!currentUser);
  const assignedTests = useFirestoreAssignedTests(userProfile?.id);
  const satDiagnostics = useFirestoreSatDiagnostics(userProfile?.id);
  const satPractices = useFirestoreSatPractices(userProfile?.id);
  const satTests = useFirestoreSatTests(userProfile?.id);

  const logAgentEvent = async (eventData: Omit<AgentEvent, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'agentEvents'), eventData);
      return docRef.id;
    } catch (e) {
      console.error('Error logging agent event:', e);
      return '';
    }
  };

  const saveMisconceptionCase = async (caseData: Omit<MisconceptionCase, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'misconceptionCases'), caseData);
      return docRef.id;
    } catch (e) {
      console.error('Error saving misconception case:', e);
      return '';
    }
  };

  useEffect(() => {
    const storedQuizzes = courses.flatMap(course => Object.values(course.quizzes || {}));
    if (storedQuizzes.length) {
      setQuizzes(current => ({ ...current, ...Object.fromEntries(storedQuizzes.map(quiz => [quiz.id, quiz])) }));
    }
  }, [courses]);

  useEffect(() => {
    const unsubscribeAuth = initAuth(
      async (user) => {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile({ ...userDoc.data(), id: user.uid } as User);
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          console.error("Error loading user profile", e);
        } finally {
          setIsAuthReady(true);
          setLoading(false);
        }
      },
      () => {
        setCurrentUser(null);
        setUserProfile(null);
        setIsAuthReady(true);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (userProfile) {
      const updatedMe = users.find(u => u.id === userProfile.id);
      if (updatedMe && JSON.stringify(updatedMe) !== JSON.stringify(userProfile)) {
        setUserProfile(updatedMe);
      }
    }
  }, [users, userProfile]);

  const linkedStudents = React.useMemo(() => {
    if (!userProfile || userProfile.role !== 'parent' || !userProfile.childIds) {
      return [];
    }
    return users.filter(
      (u) => u.role === 'student' && userProfile.childIds?.includes(u.id)
    );
  }, [userProfile, users]);

  const linkChild = async (parentUid: string, studentLinkCode: string) => {
    const student = users.find(
      (u) => u.role === 'student' && u.linkCode === studentLinkCode
    );
    if (!student) {
      throw new Error('Invalid student link code.');
    }
    const parentRef = doc(db, 'users', parentUid);
    await updateDoc(parentRef, {
      childIds: arrayUnion(student.id),
    });
  };

  const unlinkChild = async (parentUid: string, childUid: string) => {
    const parentRef = doc(db, 'users', parentUid);
    await updateDoc(parentRef, {
      childIds: arrayRemove(childUid),
    });
  };

  const addLesson = async (courseId: string, lesson: Lesson) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const newLessons = [...course.lessons, lesson];
      await updateDoc(doc(db, 'courses', courseId), { lessons: newLessons });
    }
  };

  const addQuiz = (quizId: string, quiz: Quiz) => {
    setQuizzes(prev => ({ ...prev, [quizId]: quiz }));
  };

  const completeLesson = async (lessonId: string, pointsEarned: number, quizScore?: number) => {
    if (!completedLessons.includes(lessonId) && userProfile && userProfile.role === 'student') {
      const newCompleted = [...completedLessons, lessonId];
      
      const updatedPoints = (userProfile.points || 0) + pointsEarned;
      const updatedLevel = Math.floor(updatedPoints / 500) + 1;
      
      const earned = checkBadges({
        points: updatedPoints,
        completedCount: newCompleted.length,
        lastQuizScore: quizScore,
        streak: userProfile.streak
      });
      const newBadges = [...new Set([...earnedBadges, ...earned])];
      
      await updateDoc(doc(db, 'users', userProfile.id), {
        points: updatedPoints,
        level: updatedLevel,
        completedLessons: newCompleted,
        earnedBadges: newBadges,
        learningRecords: arrayUnion({ lessonId, completedAt: new Date().toISOString(), ...(quizScore !== undefined ? { quizScore } : {}) })
      });
    }
  };

  const awardBadge = async (badgeId: string) => {
    if (userProfile && !earnedBadges.includes(badgeId)) {
      await updateDoc(doc(db, 'users', userProfile.id), {
        earnedBadges: [...earnedBadges, badgeId]
      });
    }
  };

  const saveQuizSubmission = async (submissionData: Omit<QuizSubmission, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'quizSubmissions'), submissionData);
      return docRef.id;
    } catch (e) {
      console.error('Error saving quiz submission:', e);
      return '';
    }
  };

  const promptRetake = async (promptData: Omit<RetakePrompt, 'id'>) => {
    try {
      await addDoc(collection(db, 'retakePrompts'), promptData);
    } catch (e) {
      console.error('Error adding retake prompt:', e);
    }
  };

  const updateSubmissionFeedback = async (submissionId: string, teacherFeedback: string) => {
    try {
      await updateDoc(doc(db, 'quizSubmissions', submissionId), { teacherFeedback });
    } catch (e) {
      console.error('Error updating submission feedback:', e);
    }
  };

  const markRetakeCompleted = async (promptId: string) => {
    try {
      await updateDoc(doc(db, 'retakePrompts', promptId), { status: 'completed' });
    } catch (e) {
      console.error('Error marking retake completed:', e);
    }
  };

  const logEmotionalState = async (logData: EmotionalStateLog): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'emotionalStateLogs'), {
        ...logData,
        studentId: logData.userId || logData.studentId || userProfile?.id || 'anonymous'
      });
      return docRef.id;
    } catch (e) {
      console.error('Error logging emotional state:', e);
      return '';
    }
  };

  const saveInterventionRecord = async (recordData: InterventionRecord): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'interventionHistory'), recordData);
      return docRef.id;
    } catch (e) {
      console.error('Error saving intervention record:', e);
      return '';
    }
  };

  // SAT Session Saving Methods
  const saveSatDiagnosticSession = async (session: Omit<SatDiagnosticSession, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'satDiagnosticSessions'), session);
      // Update student satProfile
      if (userProfile?.id) {
        const updatedPlacement = {
          ...(userProfile.satProfile?.placementByDomain || {}),
          ...session.placementByDomain
        };
        await updateDoc(doc(db, 'users', userProfile.id), {
          'satProfile.diagnosticCompleted': true,
          'satProfile.placementByDomain': updatedPlacement
        });
      }
      return docRef.id;
    } catch (e) {
      console.error('Error saving SAT diagnostic session:', e);
      return '';
    }
  };

  const saveSatPracticeSession = async (session: Omit<SatPracticeSession, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'satPracticeSessions'), session);
      return docRef.id;
    } catch (e) {
      console.error('Error saving SAT practice session:', e);
      return '';
    }
  };

  const saveSatPracticeTest = async (test: Omit<SatPracticeTest, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'satPracticeTests'), test);
      return docRef.id;
    } catch (e) {
      console.error('Error saving SAT practice test:', e);
      return '';
    }
  };

  const assignSatTest = async (assignment: Omit<AssignedTest, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'assignedTests'), assignment);
      // Create notifications for assigned students
      for (const studentId of assignment.assignedToUserIds) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: studentId,
          title: 'New SAT Test Assigned',
          message: `${assignment.assignedByTeacherName || 'Your teacher'} assigned an SAT ${assignment.testConfig.section} practice test.`,
          type: 'sat_assignment',
          read: false,
          targetId: docRef.id,
          createdAt: new Date().toISOString()
        });
      }
      return docRef.id;
    } catch (e) {
      console.error('Error assigning SAT test:', e);
      return '';
    }
  };

  const updateSatPlacement = async (domain: SatDomain, level: 'beginner' | 'intermediate' | 'expert') => {
    if (!userProfile?.id) return;
    try {
      const currentPlacements = userProfile.satProfile?.placementByDomain || {};
      const newPlacements = { ...currentPlacements, [domain]: level };
      await updateDoc(doc(db, 'users', userProfile.id), {
        'satProfile.placementByDomain': newPlacements
      });
      setUserProfile({
        ...userProfile,
        satProfile: {
          ...userProfile.satProfile,
          placementByDomain: newPlacements
        }
      });
    } catch (e) {
      console.error('Error updating SAT placement:', e);
    }
  };

  const recordSkillAttempt = async (
    skill: string,
    domain: SatDomain,
    correct: boolean,
    paceSeconds: number,
    difficulty: string
  ) => {
    if (!userProfile?.id) return;
    try {
      const existing = userProfile.satProfile?.skillUnderstanding?.[skill];
      const prevAttempts = existing?.attempts || 0;
      const prevCorrect = existing?.correct || 0;
      const newAttempts = prevAttempts + 1;
      const newCorrect = prevCorrect + (correct ? 1 : 0);
      const newAccuracy = Math.round((newCorrect / newAttempts) * 100);

      const prevPace = existing?.averagePaceSeconds || paceSeconds;
      const newAvgPace = Math.round((prevPace * prevAttempts + paceSeconds) / newAttempts);
      const expectedPace = domain === 'algebra' || domain === 'advanced-math' || domain === 'problem-solving-data-analysis' || domain === 'geometry-trigonometry' ? 75 : 50;

      let paceStatus: 'fast' | 'optimal' | 'deliberate' | 'slow' = 'optimal';
      if (newAvgPace < 30) paceStatus = 'fast';
      else if (newAvgPace <= 75) paceStatus = 'optimal';
      else if (newAvgPace <= 110) paceStatus = 'deliberate';
      else paceStatus = 'slow';

      let tier: 'beginner' | 'intermediate' | 'expert' = 'intermediate';
      if (newAccuracy >= 80 && newAttempts >= 4) tier = 'expert';
      else if (newAccuracy < 50 && newAttempts >= 4) tier = 'beginner';

      // Growth-oriented framing (Framing Rule: non-negotiable)
      let growthFraming = `${skill}: steady progression.`;
      if (newAccuracy >= 80) growthFraming = `${skill}: strong mastery. Ready for advanced timed challenges.`;
      else if (newAccuracy >= 50) growthFraming = `${skill}: consistent practice building precision. Focus this week: timed accuracy.`;
      else growthFraming = `${skill}: this week's active focus area. Recommended: explore step-by-step textbook models.`;

      const updatedSkill: SkillUnderstandingMetrics = {
        skill,
        domain,
        attempts: newAttempts,
        correct: newCorrect,
        accuracy: newAccuracy,
        averagePaceSeconds: newAvgPace,
        expectedPaceSeconds: expectedPace,
        paceStatus,
        textbookReviewCount: existing?.textbookReviewCount || 0,
        remediationAttempts: existing?.remediationAttempts || 0,
        remediationSuccessCount: existing?.remediationSuccessCount || 0,
        errorClassification: existing?.errorClassification || (correct ? 'none' : 'conceptual'),
        currentPacingTier: tier,
        growthFraming,
        lastAttemptAt: new Date().toISOString()
      };

      const newUnderstanding = {
        ...(userProfile.satProfile?.skillUnderstanding || {}),
        [skill]: updatedSkill
      };

      const updatedSatProfile = {
        ...(userProfile.satProfile || {}),
        skillUnderstanding: newUnderstanding
      };

      await updateDoc(doc(db, 'users', userProfile.id), {
        'satProfile.skillUnderstanding': newUnderstanding
      });

      setUserProfile({
        ...userProfile,
        satProfile: updatedSatProfile
      });
    } catch (e) {
      console.error('Error recording skill attempt:', e);
    }
  };

  const recordTextbookFollowThrough = async (
    skill: string,
    domain: SatDomain,
    reattemptCorrect?: boolean
  ) => {
    if (!userProfile?.id) return;
    try {
      const existing = userProfile.satProfile?.skillUnderstanding?.[skill];
      const prevReviewCount = existing?.textbookReviewCount || 0;
      const newReviewCount = prevReviewCount + 1;

      let prevRemedAttempts = existing?.remediationAttempts || 0;
      let prevRemedSuccess = existing?.remediationSuccessCount || 0;
      if (reattemptCorrect !== undefined) {
        prevRemedAttempts += 1;
        if (reattemptCorrect) prevRemedSuccess += 1;
      }

      // Diagnose error type:
      // If student reviews textbook and solves reattempt correctly -> Retrieval error
      // If student reviews textbook and still misses -> Conceptual error
      let errorClassification: 'none' | 'retrieval' | 'conceptual' | 'fluency' = 'none';
      if (existing && existing.accuracy < 60) {
        if (prevRemedSuccess > 0 && prevRemedSuccess / Math.max(1, prevRemedAttempts) >= 0.6) {
          errorClassification = 'retrieval';
        } else {
          errorClassification = 'conceptual';
        }
      } else if (existing && existing.paceStatus === 'slow') {
        errorClassification = 'fluency';
      }

      const updatedSkill: SkillUnderstandingMetrics = {
        skill,
        domain,
        attempts: existing?.attempts || 1,
        correct: existing?.correct || 0,
        accuracy: existing?.accuracy || 0,
        averagePaceSeconds: existing?.averagePaceSeconds || 60,
        expectedPaceSeconds: existing?.expectedPaceSeconds || 60,
        paceStatus: existing?.paceStatus || 'optimal',
        textbookReviewCount: newReviewCount,
        remediationAttempts: prevRemedAttempts,
        remediationSuccessCount: prevRemedSuccess,
        errorClassification,
        currentPacingTier: existing?.currentPacingTier || 'intermediate',
        growthFraming: errorClassification === 'retrieval'
          ? `${skill}: strong concept grasp after review. Target: speed up cold recall.`
          : `${skill}: active mastery focus. Exploring worked models in Textbook Library.`,
        lastAttemptAt: new Date().toISOString()
      };

      const newUnderstanding = {
        ...(userProfile.satProfile?.skillUnderstanding || {}),
        [skill]: updatedSkill
      };

      await updateDoc(doc(db, 'users', userProfile.id), {
        'satProfile.skillUnderstanding': newUnderstanding,
        'satProfile.textbookFollowThroughTotal': (userProfile.satProfile?.textbookFollowThroughTotal || 0) + 1
      });

      setUserProfile({
        ...userProfile,
        satProfile: {
          ...(userProfile.satProfile || {}),
          skillUnderstanding: newUnderstanding,
          textbookFollowThroughTotal: (userProfile.satProfile?.textbookFollowThroughTotal || 0) + 1
        }
      });
    } catch (e) {
      console.error('Error recording textbook follow through:', e);
    }
  };

  const updateCognitiveProfile = async (profile: Partial<CognitiveProfile>) => {
    if (!userProfile?.id) return;
    try {
      const updated = { ...(userProfile.cognitiveProfile || {}), ...profile };
      await updateDoc(doc(db, 'users', userProfile.id), {
        cognitiveProfile: updated
      });
      setUserProfile({ ...userProfile, cognitiveProfile: updated as CognitiveProfile });
    } catch (e) {
      console.error('Error updating cognitive profile:', e);
    }
  };

  const updateConsent = async (consentUpdate: Partial<NonNullable<User['consent']>>) => {
    if (!userProfile?.id) return;
    try {
      const updatedConsent = {
        deviceSync: false,
        cameraWellness: false,
        whatsappNotifications: false,
        updatedAt: new Date().toISOString(),
        ...(userProfile.consent || {}),
        ...consentUpdate
      };
      await updateDoc(doc(db, 'users', userProfile.id), {
        consent: updatedConsent
      });
      setUserProfile({ ...userProfile, consent: updatedConsent });
    } catch (e) {
      console.error('Error updating consent:', e);
    }
  };

  const leaderboard = users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const userAge = userProfile?.dateOfBirth ? computeAge(userProfile.dateOfBirth) : (userProfile?.age || 18);
  const isMinor = userProfile?.role === 'student' && userAge < 14;
  const hasLinkedParent = (userProfile?.parentIds?.length || 0) > 0 || !!userProfile?.parentId;
  const canAccessSettings = !isMinor || (isMinor && hasLinkedParent);
  const canAccessVR = !isMinor || (isMinor && hasLinkedParent && userProfile?.consent?.deviceSync === true);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      userProfile,
      setUserProfile,
      allUsers: users,
      linkedStudents,
      loading,
      linkChild,
      unlinkChild,
      isAuthReady,
      users,
      courses,
      quizzes,
      completedLessons,
      completeLesson,
      earnedBadges,
      awardBadge,
      leaderboard,
      messages: [],
      addLesson,
      addQuiz,
      submissions,
      retakePrompts,
      agentEvents,
      misconceptionCases,
      isMinor,
      canAccessSettings,
      canAccessVR,
      saveQuizSubmission,
      promptRetake,
      updateSubmissionFeedback,
      markRetakeCompleted,
      logAgentEvent,
      saveMisconceptionCase,
      logEmotionalState,
      saveInterventionRecord,

      // SAT additions
      satQuestions,
      assignedTests,
      satDiagnostics,
      satPractices,
      satTests,
      saveSatDiagnosticSession,
      saveSatPracticeSession,
      saveSatPracticeTest,
      assignSatTest,
      updateSatPlacement,
      recordSkillAttempt,
      recordTextbookFollowThrough,
      updateCognitiveProfile,
      updateConsent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
