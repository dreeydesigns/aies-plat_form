import React, { useRef, useState } from 'react';
import { useAppContext, QuizSubmission } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/shared/EmptyState';
import { Users, Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, MessageSquare, Sparkles, Filter, FileText, Search, Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function TeacherRoster() {
  const navigate = useNavigate();
  const { users, courses, submissions, retakePrompts, promptRetake, updateSubmissionFeedback, currentUser } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'roster' | 'grading'>('roster');
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [filterScore, setFilterScore] = useState<'all' | 'low' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Retake modal state
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [retakeTarget, setRetakeTarget] = useState<QuizSubmission | null>(null);
  const [retakeNote, setRetakeNote] = useState('');
  const [isSubmittingRetake, setIsSubmittingRetake] = useState(false);

  // Feedback note state
  const [feedbackText, setFeedbackText] = useState('');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const students = users.filter(u => u.role === 'student');

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      const headers = lines[0]?.toLowerCase().split(',').map(h => h.trim());
      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const gradeIdx = headers.indexOf('grade');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const columns = line.split(',');
        
        const name = nameIdx !== -1 ? columns[nameIdx] : columns[0];
        const email = emailIdx !== -1 ? columns[emailIdx] : null;
        const grade = gradeIdx !== -1 ? columns[gradeIdx] : null;
        
        if (name && name.trim()) {
          try {
            await addDoc(collection(db, 'users'), {
              name: name.trim(),
              email: email ? email.trim() : null,
              grade: grade ? grade.trim() : null,
              role: 'student',
              level: 1,
              points: 0,
              streak: 0,
              completedLessons: [],
              earnedBadges: []
            });
          } catch (error) {
            console.error('Error adding student:', error);
          }
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendRetakePrompt = async () => {
    if (!retakeTarget || !currentUser) return;

    setIsSubmittingRetake(true);
    try {
      await promptRetake({
        studentId: retakeTarget.studentId,
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || 'Teacher',
        type: 'quiz',
        targetId: retakeTarget.quizId,
        courseId: retakeTarget.courseId,
        lessonId: retakeTarget.lessonId,
        targetTitle: `${retakeTarget.quizTitle} (Retake)`,
        note: retakeNote.trim() || 'Please review your course notes and retake this exam to improve your grade.',
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      setIsRetakeModalOpen(false);
      setRetakeTarget(null);
      setRetakeNote('');
    } catch (e) {
      console.error('Failed to prompt retake:', e);
    } finally {
      setIsSubmittingRetake(false);
    }
  };

  const handleSaveFeedback = async () => {
    if (!selectedSubmission) return;
    setIsSavingFeedback(true);
    try {
      await updateSubmissionFeedback(selectedSubmission.id, feedbackText);
      setSelectedSubmission(prev => prev ? { ...prev, teacherFeedback: feedbackText } : null);
    } catch (e) {
      console.error('Failed to save feedback:', e);
    } finally {
      setIsSavingFeedback(false);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterScore === 'low') return sub.score < 60;
    if (filterScore === 'high') return sub.score >= 80;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Students & Grading Hub</h2>
          <p className="text-neutral-500">Monitor student accuracy, review exam submissions, and prompt targeted retakes.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleImportCsv} 
            className="hidden" 
            id="csv-upload"
          />
          <label 
            htmlFor="csv-upload"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 text-sm font-bold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 gap-6">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Student Roster ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('grading')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'grading'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Exams & Submissions ({submissions.length})
          {submissions.some(s => s.score < 60) && (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>
      </div>

      {/* TAB 1: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <>
          {students.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No Students Found"
              description="There are currently no students in your roster."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Exams Submitted</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Avg Exam Score</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Points & Level</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Assigned Retakes</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {students.map(student => {
                      const studentSubs = submissions.filter(s => s.studentId === student.id);
                      const avgScore = studentSubs.length > 0
                        ? Math.round(studentSubs.reduce((acc, s) => acc + s.score, 0) / studentSubs.length)
                        : null;

                      const pendingPrompts = retakePrompts.filter(p => p.studentId === student.id && p.status === 'pending');

                      return (
                        <tr 
                          key={student.id} 
                          className="hover:bg-neutral-50 cursor-pointer"
                          onClick={() => navigate(`/teacher/students/${student.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-blue-600 hover:underline">{student.name}</div>
                            {student.grade && <div className="text-xs text-neutral-400">Grade: {student.grade}</div>}
                          </td>
                          <td className="px-6 py-4 font-bold text-neutral-700 text-sm">
                            {studentSubs.length} submission{studentSubs.length === 1 ? '' : 's'}
                          </td>
                          <td className="px-6 py-4">
                            {avgScore !== null ? (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                avgScore >= 80 ? 'bg-green-100 text-green-800' : avgScore >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {avgScore}%
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs italic">No exams taken</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            <span className="font-bold text-neutral-800">{student.points || 0} pts</span> · Lvl {student.level || 1}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {pendingPrompts.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                <AlertCircle className="w-3.5 h-3.5" /> {pendingPrompts.length} Pending
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-400">None pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => navigate(`/teacher/students/${student.id}`)}
                                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={async () => {
                                  const isLeader = student.socialPersonality?.isSquadLeader || false;
                                  const { doc, updateDoc } = await import('firebase/firestore');
                                  await updateDoc(doc(db, 'users', student.id), {
                                    'socialPersonality.isSquadLeader': !isLeader,
                                    'socialPersonality.leadershipDrive': !isLeader ? 'high' : 'medium'
                                  });
                                }}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                                  student.socialPersonality?.isSquadLeader 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                }`}
                                title="Assign high-responsibility peer mentor role to direct leadership positively"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                {student.socialPersonality?.isSquadLeader ? 'Squad Leader ✓' : '+ Make Squad Leader'}
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {student.parentIds && student.parentIds.length > 0 && (
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    navigate(`/teacher/messages?contactId=${student.parentIds[0]}`);
                                  }}
                                  className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors"
                                >
                                  Message Guardian
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: EXAMS & SUBMISSIONS GRADING HUB */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="relative flex-1 w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by student name or exam title..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={filterScore}
                onChange={e => setFilterScore(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm font-medium px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Submissions ({submissions.length})</option>
                <option value="low">Low Scores (&lt; 60%)</option>
                <option value="high">High Scores (≥ 80%)</option>
              </select>
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Exam Submissions Found"
              description="No student exam submissions match your filter criteria."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Exam Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Submitted Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Attempt #</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredSubmissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-semibold text-neutral-900">{sub.studentName}</td>
                        <td className="px-6 py-4 text-neutral-700 font-medium">{sub.quizTitle}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            sub.score >= 80 ? 'bg-green-100 text-green-800' : sub.score >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.score}% ({sub.correctCount}/{sub.totalQuestions})
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-neutral-500">
                          {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-neutral-600">
                          #{sub.attemptNumber || 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setFeedbackText(sub.teacherFeedback || '');
                              }}
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
            </div>
          )}
        </div>
      )}

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
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase">Adaptive Level</span>
                  <p className="text-sm font-bold text-blue-700 uppercase">{selectedSubmission.adaptivePath}</p>
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
                    {q.explanation && (
                      <p className="text-xs text-neutral-600 bg-white p-2.5 rounded-lg border border-neutral-200 italic">
                        Guidance: {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Teacher Custom Feedback */}
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                <h4 className="font-bold text-neutral-800 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Personalized Teacher Feedback to Student
                </h4>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  rows={3}
                  placeholder="Enter custom feedback or notes for this student submission..."
                  className="w-full p-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveFeedback}
                    disabled={isSavingFeedback}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSavingFeedback ? 'Saving...' : 'Send Feedback'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-between gap-3">
              <button
                onClick={() => {
                  setRetakeTarget(selectedSubmission);
                  setIsRetakeModalOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Prompt Student to Retake
              </button>
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
              Prompt Retake for {retakeTarget.studentName}
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
                placeholder="Example: Please review the quadratic formula rules in Section 2, then re-attempt this quiz to improve your grade."
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
