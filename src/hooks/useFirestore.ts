import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Course, QuizSubmission, RetakePrompt } from '../context/AppContext';

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
        // Sort newest first
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
