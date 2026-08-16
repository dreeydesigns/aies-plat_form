import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Users, RefreshCw, Eye, Sparkles, Send, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext, QuizSubmission } from '../../context/AppContext';
import EmptyState from '../../components/shared/EmptyState';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, submissions, retakePrompts, promptRetake, currentUser } = useAppContext();
  
  const student = users.find(s => s.id === id && s.role === 'student');
  const [strengths, setStrengths] = useState(student?.teacherReport?.strengths || '');
  const [supportNeeds, setSupportNeeds] = useState(student?.teacherReport?.supportNeeds || '');
  const [remarks, setRemarks] = useState(student?.teacherReport?.remarks || '');
  const [isSaving, setIsSaving] = useState(false);

  // Submission Inspection Modal
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);

  // Retake Modal State
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [retakeTarget, setRetakeTarget] = useState<QuizSubmission | null>(null);
  const [retakeNote, setRetakeNote] = useState('');
  const [isSubmittingRetake, setIsSubmittingRetake] = useState(false);

  if (!student) {
    return (
      <EmptyState 
        icon={Users}
        title="Student Not Found"
        description="The student you are looking for does not exist or has been removed."
        action={{
          label: "Back to Roster",
          onClick: () => navigate('/teacher/students')
        }}
      />
    );
  }

  const studentSubmissions = submissions.filter(s => s.studentId === student.id);
  const studentPrompts = retakePrompts.filter(p => p.studentId === student.id);
  const avgScore = studentSubmissions.length > 0
    ? Math.round(studentSubmissions.reduce((acc, s) => acc + s.score, 0) / studentSubmissions.length)
    : null;

  const saveTeacherReport = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', student.id), { teacherReport: { strengths, supportNeeds, remarks, updatedAt: new Date().toISOString() } });
    } finally { setIsSaving(false); }
  };

  const handleSendRetakePrompt = async () => {
    if (!retakeTarget || !currentUser) return;

    setIsSubmittingRetake(true);
    try {
      await promptRetake({
        studentId: student.id,
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || 'Teacher',
        type: 'quiz',
        targetId: retakeTarget.quizId,
        courseId: retakeTarget.courseId,
        lessonId: retakeTarget.lessonId,
        targetTitle: `${retakeTarget.quizTitle} (Retake)`,
        note: retakeNote.trim() || 'Please review your course notes and retake this exam.',
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      setIsRetakeModalOpen(false);
      setRetakeTarget(null);
      setRetakeNote('');
    } catch (e) {
      console.error('Failed to send retake prompt:', e);
    } finally {
      setIsSubmittingRetake(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <span className="hover:text-neutral-800 cursor-pointer" onClick={() => navigate('/teacher/students')}>Roster</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{student.name}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{student.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active Student
              </span>
              <span className="text-sm text-neutral-500">Level {student.level || 1} • {student.points || 0} pts</span>
              {avgScore !== null && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  avgScore >= 80 ? 'bg-green-100 text-green-800' : avgScore >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Exam Avg: {avgScore}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => navigate(`/teacher/messages?contactId=${student.id}`)}
            className="px-6 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Message Student
          </button>
          {student.parentIds && student.parentIds.length > 0 && (
            <button 
              onClick={() => navigate(`/teacher/messages?contactId=${student.parentIds[0]}`)}
              className="px-6 py-2.5 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Message Guardian
            </button>
          )}
        </div>
      </div>

      {/* SAT Domain Mastery & Placement Summary (Spec v3 Section 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-neutral-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              SAT Math Placement
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
              student.classificationMath === 'expert'
                ? 'bg-purple-100 text-purple-800'
                : student.classificationMath === 'intermediate'
                ? 'bg-blue-100 text-blue-800'
                : student.classificationMath === 'beginner'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {student.classificationMath ? `${student.classificationMath} Tier` : 'Not Yet Assessed'}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Algebra</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['algebra'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Advanced Math</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['advanced-math'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Problem-Solving & Data</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['problem-solving-data-analysis'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Geometry & Trig</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['geometry-trigonometry'] || 'Pending Diagnostic'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-neutral-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              SAT Reading & Writing Placement
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
              student.classificationRW === 'expert'
                ? 'bg-purple-100 text-purple-800'
                : student.classificationRW === 'intermediate'
                ? 'bg-emerald-100 text-emerald-800'
                : student.classificationRW === 'beginner'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {student.classificationRW ? `${student.classificationRW} Tier` : 'Not Yet Assessed'}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Information & Ideas</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['information-ideas'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Craft & Structure</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['craft-structure'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Expression of Ideas</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['expression-of-ideas'] || 'Pending Diagnostic'}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-600">
              <span>Standard English Conventions</span>
              <span className="font-bold text-neutral-900">
                {student.satProfile?.placementByDomain?.['standard-english-conventions'] || 'Pending Diagnostic'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Analytics & Retake Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Retakes */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-2 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-600" />
            Teacher Retake Requests ({studentPrompts.length})
          </h3>
          <p className="text-sm text-neutral-500 mb-4">Pending and completed retake prompts for this student.</p>
          {studentPrompts.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">No retakes requested yet for this student.</p>
          ) : (
            <div className="space-y-3">
              {studentPrompts.map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-neutral-800">{p.targetTitle}</span>
                    {p.note && <p className="text-xs text-neutral-500 italic mt-0.5">"{p.note}"</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status === 'completed' ? 'Completed ✓' : 'Pending Retake'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adaptive ML Status */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Adaptive ML Performance Analysis
          </h3>
          <p className="text-neutral-600 text-sm mb-4">Based on recent exam submissions and lesson completion speed:</p>
          <div className={`p-4 rounded-xl border mb-4 ${
            avgScore !== null && avgScore < 60 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <h4 className="font-bold mb-1 text-sm">
              {avgScore !== null && avgScore < 60 ? 'Attention Needed: Remedial Path Suggested' : 'Standard Learning Progression'}
            </h4>
            <p className="text-xs">
              {avgScore !== null && avgScore < 60
                ? 'Student is scoring below 60% average on recent assessments. Prompting a retake or supplementary revision is recommended.'
                : 'Student is meeting curriculum targets cleanly.'}
            </p>
          </div>
        </div>
      </div>

      {/* EXAM SUBMISSION HISTORY TABLE */}
      <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Student Exam & Quiz Submissions ({studentSubmissions.length})
          </h3>
        </div>

        {studentSubmissions.length === 0 ? (
          <p className="text-sm text-neutral-400 italic py-4">No exam submissions recorded for this student yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Exam Title</th>
                  <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Submitted At</th>
                  <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Attempt #</th>
                  <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {studentSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-semibold text-neutral-900 text-sm">{sub.quizTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        sub.score >= 80 ? 'bg-green-100 text-green-800' : sub.score >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.score}% ({sub.correctCount}/{sub.totalQuestions})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-neutral-600">
                      #{sub.attemptNumber || 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Paper
                        </button>
                        <button
                          onClick={() => {
                            setRetakeTarget(sub);
                            setIsRetakeModalOpen(true);
                          }}
                          className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Prompt Retake
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Guardian Report Notes */}
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

      {/* INSPECT SUBMISSION DRAWER / MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedSubmission.quizTitle}</h3>
                  <p className="text-sm text-neutral-500">Student: <span className="font-bold text-neutral-800">{selectedSubmission.studentName}</span> · Attempt #{selectedSubmission.attemptNumber || 1}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-neutral-400 hover:text-neutral-700 text-lg font-bold px-2"
                >
                  ✕
                </button>
              </div>

              {/* Performance Banner */}
              <div className="my-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase">Final Score</span>
                  <p className="text-2xl font-bold text-neutral-900">{selectedSubmission.score}%</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase">Correct Questions</span>
                  <p className="text-base font-bold text-neutral-800">{selectedSubmission.correctCount} / {selectedSubmission.totalQuestions}</p>
                </div>
              </div>

              {/* Questions Breakdown */}
              <div className="space-y-6">
                <h4 className="font-bold text-neutral-800">Exam Question Responses</h4>
                {selectedSubmission.questionDetails?.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/50">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-neutral-900 text-sm">{idx + 1}. {q.text}</h5>
                      {q.isCorrect ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Correct
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Incorrect
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = q.selectedAnswer === optIdx;
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div key={optIdx} className={`p-2 rounded border flex justify-between ${
                            isCorrect ? 'bg-green-50 border-green-200 text-green-900 font-bold' :
                            isChosen && !isCorrect ? 'bg-red-50 border-red-200 text-red-800 line-through' :
                            'bg-white border-neutral-100 text-neutral-600'
                          }`}>
                            <span>{opt}</span>
                            {isCorrect && <span>✓ Correct Answer</span>}
                            {isChosen && !isCorrect && <span>Selected by Student</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2.5 bg-neutral-100 text-neutral-700 font-bold text-sm rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMPT RETAKE MODAL */}
      {isRetakeModalOpen && retakeTarget && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              Prompt Retake for {student.name}
            </h3>
            <p className="text-sm text-neutral-500">
              Exam: <span className="font-semibold text-neutral-800">{retakeTarget.quizTitle}</span> (Current Score: {retakeTarget.score}%)
            </p>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Teacher Note / Guidance for Student</label>
              <textarea
                value={retakeNote}
                onChange={e => setRetakeNote(e.target.value)}
                rows={4}
                placeholder="Example: Please review the key concepts in this module before retaking this exam."
                className="w-full p-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-neutral-50"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => {
                  setIsRetakeModalOpen(false);
                  setRetakeTarget(null);
                }}
                className="px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRetakePrompt}
                disabled={isSubmittingRetake}
                className="px-6 py-2 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isSubmittingRetake ? 'Sending Prompt...' : 'Send Retake Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
