import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Course } from '../context/AppContext';

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
