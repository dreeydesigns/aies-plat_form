import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, UserCheck, TrendingUp, Search, Loader2, Radio, Sparkles, PlusCircle, RefreshCw, Eye, MessageSquare, BookOpen, Activity, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { collection, limit, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import VoiceInput from '../../components/shared/VoiceInput';

type Reading = { userId: string; bpm: number; recordedAt?: Timestamp; clientRecordedAt?: string };

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { users, courses, submissions, retakePrompts } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [liveSession, setLiveSession] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);

  const students = users.filter(u => u.role === 'student');
  const studentIds = useMemo(() => new Set(students.map(student => student.id)), [users]);
  const totalLessons = courses.reduce((total, course) => total + course.lessons.length, 0);

  const progressRows = useMemo(() => students.map(student => {
    const completed = student.completedLessons?.length || 0;
    return { name: student.name, progress: totalLessons ? Math.round((completed / totalLessons) * 100) : 0, points: student.points || 0 };
  }), [students, totalLessons]);

  const averageProgress = progressRows.length ? Math.round(progressRows.reduce((sum, row) => sum + row.progress, 0) / progressRows.length) : 0;

  // Real-time Wearable Readings Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'deviceData'), orderBy('recordedAt', 'desc'), limit(100)), snapshot => {
      setReadings(snapshot.docs.flatMap(document => {
        const data = document.data();
        const bpm = data.payload?.bpm;
        return data.source === 'bluetooth_heart_rate' && studentIds.has(data.userId) && Number.isFinite(bpm)
          ? [{ userId: data.userId, bpm, recordedAt: data.recordedAt, clientRecordedAt: data.clientRecordedAt }]
          : [];
      }));
    }, error => { console.error('Unable to load wearable readings', error); setReadings([]); });
    return unsubscribe;
  }, [studentIds]);

  const latestByStudent = useMemo(() => new Map(readings.map(reading => [reading.userId, reading])), [readings]);
  const checkedIn = students.filter(student => {
    const reading = latestByStudent.get(student.id);
    const at = reading?.recordedAt?.toDate?.() || (reading?.clientRecordedAt ? new Date(reading.clientRecordedAt) : null);
    return at && Date.now() - at.getTime() <= 5 * 60 * 1000;
  });

  // Calculate low score students needing attention (<60% avg)
  const lowScoreSubmissions = submissions.filter(s => s.score < 60);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true); setSearchResult(''); setSearchSources([]);
    try {
      const response = await fetch('/api/gemini/grounding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: searchQuery }) });
      const data = await response.json();
      if (data.error) setSearchResult(`Error: ${data.error}`); else { setSearchResult(data.result); setSearchSources(data.sources || []); }
    } catch { setSearchResult('Failed to fetch resources. Please try again later.'); } finally { setIsSearching(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with AI Co-Teacher Call to Action */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-yellow-300 px-3 py-1 rounded-full w-fit mb-3 border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> High-Tech Educator Control Center
          </span>
          <h2 className="text-3xl font-bold mb-2">Teacher Intelligence & Class Hub</h2>
          <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
            Monitor real-time student engagement, generate AI-tailored course units, review exam submissions, and assign targeted retakes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/teacher/courses/new')}
            className="px-6 py-3 bg-white text-blue-900 font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 text-sm"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            AI Co-Teacher Course Builder
          </button>
          <button
            onClick={() => navigate('/teacher/students')}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 border border-white/20 transition-all text-sm flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Grade & Roster Hub
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Metric icon={<UserCheck className="w-6 h-6 text-blue-600" />} label="Active Students" value={students.length} />
        <Metric icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} label="Avg Class Progress" value={`${averageProgress}%`} />
        <Metric icon={<AlertCircle className="w-6 h-6 text-amber-600" />} label="Exam Submissions" value={submissions.length} />
        <Metric icon={<Activity className="w-6 h-6 text-purple-600" />} label="Wearable Check-Ins" value={liveSession ? `${checkedIn.length}/${students.length}` : 'Session Off'} />
      </div>

      {/* AI DIAGNOSTICS & PREDICTIVE INSIGHTS PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Class Diagnostics & Remedial Alerts
          </h3>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            Real-time Gemini Diagnostic
          </span>
        </div>

        {lowScoreSubmissions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>All recent student exam submissions are scoring above 60%! Class mastery is progressing smoothly.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowScoreSubmissions.slice(0, 4).map((sub) => (
              <div key={sub.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-sm">{sub.studentName}</span>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{sub.score}%</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">Failed assessment on <span className="font-semibold">{sub.quizTitle}</span>.</p>
                  <p className="text-xs text-amber-800 italic mt-1">AI Recommendation: Prompt student to retake module with teacher notes.</p>
                </div>
                <button
                  onClick={() => navigate('/teacher/students')}
                  className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 flex-shrink-0"
                >
                  Prompt Retake
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Educational Grounded Search Assistant */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Search Educational Resources & Syllabus Standards
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search teaching materials, lesson plans, or STEM guidelines..."
              className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
            <div className="absolute right-2 top-2">
              <VoiceInput onTranscript={text => setSearchQuery(prev => `${prev} ${text}`)} />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 text-sm"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
        {searchResult && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-2xl text-sm whitespace-pre-wrap border border-neutral-200">
            {searchResult}
            {searchSources.length > 0 && (
              <ul className="mt-3 list-disc pl-5">
                {searchSources.map((source, index) => (
                  <li key={index}>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Progress Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Learner Progress Breakdown</h3>
          <p className="text-xs text-neutral-500 mb-4">Percent of available course lessons completed per student.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Bar dataKey="progress" name="Recorded progress" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Recorded Gamification Points</h3>
          <p className="text-xs text-neutral-500 mb-4">Activity milestone points earned across lessons and quizzes.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" name="Points" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Wearable BLE Check-in Section */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-600" />
              Live Wearable BLE Bluetooth Sensor Radar
            </h3>
            <p className="text-xs text-neutral-500">
              Live Web Bluetooth heart-rate packets streamed from student wearables during class study sessions.
            </p>
          </div>
          <button
            onClick={() => setLiveSession(val => !val)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
              liveSession ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            {liveSession ? 'End Live Session' : 'Start Live Session'}
          </button>
        </div>

        {liveSession && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {students.map(student => {
              const reading = latestByStudent.get(student.id);
              const isCheckedIn = checkedIn.some(item => item.id === student.id);
              return (
                <div key={student.id} className="p-4 border border-neutral-200 rounded-2xl bg-neutral-50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-neutral-900 text-sm">{student.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {isCheckedIn ? `Verified HR reading: ${reading?.bpm} bpm` : 'Needs check-in: no reading in 5m.'}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isCheckedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isCheckedIn ? 'Checked in ✓' : 'Pending Check-in'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Quick Roster & Actions */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neutral-900">Student Roster Overview</h3>
          <button
            onClick={() => navigate('/teacher/students')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            View Full Students & Grading Hub →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Points</th>
                <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Level</th>
                <th className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-semibold text-neutral-900 text-sm">{student.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-700 font-bold">{student.points || 0}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">Level {student.level || 1}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/teacher/students/${student.id}`)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Inspect Profile & Papers →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-neutral-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
