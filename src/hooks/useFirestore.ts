import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Course, QuizSubmission, RetakePrompt, AgentEvent, MisconceptionCase } from '../context/AppContext';

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
