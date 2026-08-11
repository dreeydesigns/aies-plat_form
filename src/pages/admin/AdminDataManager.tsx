import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppContext, Course, User } from '../../context/AppContext';
import { BookOpen, Trash2, Users } from 'lucide-react';

export default function AdminDataManager() {
  const { userProfile } = useAppContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const stopCourses = onSnapshot(collection(db, 'courses'), snap => setCourses(snap.docs.map(item => ({ id: item.id, ...item.data() } as Course))));
    const stopUsers = onSnapshot(collection(db, 'users'), snap => setUsers(snap.docs.map(item => ({ id: item.id, ...item.data() } as User))));
    return () => { stopCourses(); stopUsers(); };
  }, []);
  const removeCourse = async (course: Course) => {
    if (!window.confirm(`Permanently delete “${course.title}” and all of its lessons?`)) return;
    await deleteDoc(doc(db, 'courses', course.id));
  };
  const removeUser = async (user: User) => {
    if (user.id === userProfile?.id) return;
    if (!window.confirm(`Permanently delete the ${user.role} account “${user.name}”?`)) return;
    await deleteDoc(doc(db, 'users', user.id));
  };
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-neutral-900">Data management</h1><p className="text-neutral-500">Remove demo courses and accounts before onboarding your institution. Each deletion needs confirmation.</p></div><section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"><div className="p-5 border-b border-neutral-100 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-600" /><h2 className="font-bold">Courses ({courses.length})</h2></div><div className="divide-y divide-neutral-100">{courses.map(course => <div key={course.id} className="p-4 flex items-center justify-between gap-4"><div><p className="font-semibold text-neutral-900">{course.title}</p><p className="text-sm text-neutral-500">{course.lessons.length} lessons · {course.description}</p></div><button onClick={() => removeCourse(course)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete course"><Trash2 className="w-5 h-5" /></button></div>)}</div></section><section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"><div className="p-5 border-b border-neutral-100 flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /><h2 className="font-bold">Accounts ({users.length})</h2></div><div className="divide-y divide-neutral-100">{users.map(user => <div key={user.id} className="p-4 flex items-center justify-between gap-4"><div><p className="font-semibold text-neutral-900">{user.name} {user.id === userProfile?.id && <span className="text-xs text-neutral-400">(you)</span>}</p><p className="text-sm text-neutral-500 capitalize">{user.role} account</p></div>{user.id !== userProfile?.id && <button onClick={() => removeUser(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete account"><Trash2 className="w-5 h-5" /></button>}</div>)}</div></section></div>;
}
