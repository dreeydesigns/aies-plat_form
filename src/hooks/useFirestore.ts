import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Course, QuizSubmission, RetakePrompt, AgentEvent, MisconceptionCase } from '../context/AppContext';
import { SatQuestion, SatDiagnosticSession, SatPracticeSession, SatPracticeTest, AssignedTest, Textbook, EmotionalStateLog } from '../types';

export function useFirestoreUsers(shouldSubscribe: boolean = true) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setUsers([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersData: User[] = [];
        snapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() } as User);
        });
        setUsers(usersData);
      },
      (error) => {
        console.error('Unable to load users:', error);
        setUsers([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return users;
}

export function useFirestoreCourses(shouldSubscribe: boolean = true) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setCourses([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        const coursesData: Course[] = [];
        snapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() } as Course);
        });
        setCourses(coursesData);
      },
      (error) => {
        console.error('Unable to load courses:', error);
        setCourses([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return courses;
}

export function useFirestoreSubmissions(shouldSubscribe: boolean = true) {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setSubmissions([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'quizSubmissions'),
      (snapshot) => {
        const subs: QuizSubmission[] = [];
        snapshot.forEach((doc) => {
          subs.push({ id: doc.id, ...doc.data() } as QuizSubmission);
        });
        subs.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
        setSubmissions(subs);
      },
      (error) => {
        console.error('Unable to load quiz submissions:', error);
        setSubmissions([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return submissions;
}

export function useFirestoreRetakePrompts(shouldSubscribe: boolean = true) {
  const [prompts, setPrompts] = useState<RetakePrompt[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setPrompts([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'retakePrompts'),
      (snapshot) => {
        const items: RetakePrompt[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as RetakePrompt);
        });
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setPrompts(items);
      },
      (error) => {
        console.error('Unable to load retake prompts:', error);
        setPrompts([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return prompts;
}

export function useFirestoreAgentEvents(shouldSubscribe: boolean = true) {
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setEvents([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'agentEvents'),
      (snapshot) => {
        const items: AgentEvent[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as AgentEvent);
        });
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setEvents(items);
      },
      (error) => {
        console.error('Unable to load agent events:', error);
        setEvents([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return events;
}

export function useFirestoreMisconceptionCases(shouldSubscribe: boolean = true) {
  const [cases, setCases] = useState<MisconceptionCase[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setCases([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'misconceptionCases'),
      (snapshot) => {
        const items: MisconceptionCase[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MisconceptionCase);
        });
        setCases(items);
      },
      (error) => {
        console.error('Unable to load misconception cases:', error);
        setCases([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return cases;
}

// SAT Hooks
export function useFirestoreSatQuestions(shouldSubscribe: boolean = true) {
  const [questions, setQuestions] = useState<SatQuestion[]>([]);

  useEffect(() => {
    if (!shouldSubscribe) {
      setQuestions([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'satQuestions'),
      (snapshot) => {
        const items: SatQuestion[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as SatQuestion);
        });
        setQuestions(items);
      },
      (error) => {
        console.error('Unable to load SAT questions:', error);
        setQuestions([]);
      }
    );
    return () => unsubscribe();
  }, [shouldSubscribe]);

  return questions;
}

export function useFirestoreAssignedTests(userId?: string) {
  const [assignedTests, setAssignedTests] = useState<AssignedTest[]>([]);

  useEffect(() => {
    if (!userId) {
      setAssignedTests([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'assignedTests'),
      (snapshot) => {
        const items: AssignedTest[] = [];
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as AssignedTest;
          if (data.assignedToUserIds?.includes(userId) || data.assignedByTeacherId === userId) {
            items.push(data);
          }
        });
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setAssignedTests(items);
      },
      (error) => {
        console.error('Unable to load assigned tests:', error);
        setAssignedTests([]);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return assignedTests;
}

export function useFirestoreSatDiagnostics(userId?: string) {
  const [diagnostics, setDiagnostics] = useState<SatDiagnosticSession[]>([]);

  useEffect(() => {
    if (!userId) {
      setDiagnostics([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'satDiagnosticSessions'),
      (snapshot) => {
        const items: SatDiagnosticSession[] = [];
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as SatDiagnosticSession;
          if (!userId || data.userId === userId) {
            items.push(data);
          }
        });
        items.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
        setDiagnostics(items);
      },
      (error) => {
        console.error('Unable to load SAT diagnostics:', error);
        setDiagnostics([]);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return diagnostics;
}

export function useFirestoreSatPractices(userId?: string) {
  const [practices, setPractices] = useState<SatPracticeSession[]>([]);

  useEffect(() => {
    if (!userId) {
      setPractices([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'satPracticeSessions'),
      (snapshot) => {
        const items: SatPracticeSession[] = [];
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as SatPracticeSession;
          if (!userId || data.userId === userId) {
            items.push(data);
          }
        });
        items.sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());
        setPractices(items);
      },
      (error) => {
        console.error('Unable to load SAT practice sessions:', error);
        setPractices([]);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return practices;
}

export function useFirestoreSatTests(userId?: string) {
  const [tests, setTests] = useState<SatPracticeTest[]>([]);

  useEffect(() => {
    if (!userId) {
      setTests([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'satPracticeTests'),
      (snapshot) => {
        const items: SatPracticeTest[] = [];
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as SatPracticeTest;
          if (!userId || data.userId === userId) {
            items.push(data);
          }
        });
        items.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
        setTests(items);
      },
      (error) => {
        console.error('Unable to load SAT tests:', error);
        setTests([]);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return tests;
}
