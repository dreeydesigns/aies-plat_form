import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import EmptyState from '../../components/shared/EmptyState';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useAppContext();
  
  const student = users.find(s => s.id === id && s.role === 'student');
  const [strengths, setStrengths] = useState(student?.teacherReport?.strengths || '');
  const [supportNeeds, setSupportNeeds] = useState(student?.teacherReport?.supportNeeds || '');
  const [remarks, setRemarks] = useState(student?.teacherReport?.remarks || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!student) {
    return (
      <EmptyState 
        icon={Users}
        title="Student Not Found"
        description="The student you are looking for does not exist or has been removed."
        action={{
          label: "Back to Roster",
          onClick: () => navigate('/teacher')
        }}
      />
    );
  }

  const saveTeacherReport = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', student.id), { teacherReport: { strengths, supportNeeds, remarks, updatedAt: new Date().toISOString() } });
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <span className="hover:text-neutral-800 cursor-pointer" onClick={() => navigate('/teacher')}>Dashboard</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{student.name}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{student.name}</h1>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
              <span className="text-sm text-neutral-500">Level {student.level || 1} • {student.points || 0} pts</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate(`/teacher/messages?contactId=${student.id}`)}
            className="px-6 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Message Student
          </button>
          {student.parentIds && student.parentIds.length > 0 && (
            <button 
              onClick={() => navigate(`/teacher/messages?contactId=${student.parentIds[0]}`)}
              className="px-6 py-2 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Message Parent
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">Completed Lesson</p>
                <p className="text-xs text-neutral-500">Recently</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Adaptive ML Recommendation</h3>
          <p className="text-neutral-600 mb-4">Based on recent performance and fatigue indicators, the system recommends:</p>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <h4 className="font-bold text-blue-900 mb-1">Standard Path</h4>
            <p className="text-sm text-blue-800">Student is progressing normally.</p>
          </div>
          <button 
            onClick={() => navigate('/teacher')}
            className="w-full px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Approve Recommendation
          </button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-800">Guardian report notes</h3>
        <p className="mt-1 text-sm text-neutral-500">These teacher-entered observations appear in the guardian's interactive report and in its generated static export.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <label className="block text-sm font-medium text-neutral-700">Strengths<textarea value={strengths} onChange={event => setStrengths(event.target.value)} rows={4} placeholder="Examples: explains ideas clearly; completes reading independently..." className="mt-2 w-full p-3 border rounded-xl font-normal" /></label>
          <label className="block text-sm font-medium text-neutral-700">Areas to strengthen<textarea value={supportNeeds} onChange={event => setSupportNeeds(event.target.value)} rows={4} placeholder="Examples: practise multi-step problems; complete revision tasks..." className="mt-2 w-full p-3 border rounded-xl font-normal" /></label>
        </div>
        <label className="block text-sm font-medium text-neutral-700 mt-4">Teacher remarks from class<textarea value={remarks} onChange={event => setRemarks(event.target.value)} rows={5} placeholder="Record specific, constructive classroom observations and agreed next steps." className="mt-2 w-full p-3 border rounded-xl font-normal" /></label>
        <button onClick={saveTeacherReport} disabled={isSaving} className="mt-4 px-5 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50">{isSaving ? 'Saving...' : 'Save guardian report notes'}</button>
      </section>
    </div>
  );
}
