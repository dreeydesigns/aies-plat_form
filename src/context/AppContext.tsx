import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkBadges } from '../utils/badge-manager';
import { initAuth, db } from '../lib/firebase';
import { collection, doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useFirestoreUsers, useFirestoreCourses } from '../hooks/useFirestore';
import { User as FirebaseAuthUser } from 'firebase/auth';

export type Role = 'student' | 'teacher' | 'parent' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  points?: number;
  level?: number;
  streak?: number;
  childIds?: string[];
  parentIds?: string[];
  linkCode?: string;
  completedLessons?: string[];
  earnedBadges?: string[];
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
    // Update userProfile if it changed in Firestore
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
        earnedBadges: newBadges
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

  const leaderboard = users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.points || 0) - (a.points || 0));

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
      addQuiz
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
