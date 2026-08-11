import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, UserCheck, TrendingUp, Search, Loader2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { collection, limit, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import VoiceInput from '../../components/shared/VoiceInput';

type Reading = { userId: string; bpm: number; recordedAt?: Timestamp; clientRecordedAt?: string };

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { users, courses } = useAppContext();
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true); setSearchResult(''); setSearchSources([]);
    try {
      const response = await fetch('/api/gemini/grounding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: searchQuery }) });
      const data = await response.json();
      if (data.error) setSearchResult(`Error: ${data.error}`); else { setSearchResult(data.result); setSearchSources(data.sources || []); }
    } catch { setSearchResult('Failed to fetch resources. Please try again later.'); } finally { setIsSearching(false); }
  };

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-bold text-neutral-800">Teacher overview</h2><p className="text-neutral-500">Progress charts use recorded AIES completion and points only.</p></div>
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"><h3 className="text-lg font-bold text-neutral-800 mb-4">Search educational resources</h3><div className="flex items-center gap-2"><div className="flex-1 relative"><input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search teaching materials, articles, or resources..." className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl" onKeyDown={event => event.key === 'Enter' && handleSearch()} /><Search className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" /><div className="absolute right-2 top-2"><VoiceInput onTranscript={text => setSearchQuery(previous => `${previous} ${text}`)} /></div></div><button onClick={handleSearch} disabled={isSearching} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl disabled:opacity-50">{isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}</button></div>{searchResult && <div className="mt-4 p-4 bg-neutral-50 rounded-xl text-sm whitespace-pre-wrap">{searchResult}{searchSources.length > 0 && <ul className="mt-3 list-disc pl-5">{searchSources.map((source, index) => <li key={index}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.title}</a></li>)}</ul>}</div>}</div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Metric icon={<UserCheck className="w-6 h-6 text-blue-600" />} label="Students" value={students.length} /><Metric icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} label="Average recorded progress" value={`${averageProgress}%`} /><Metric icon={<AlertCircle className="w-6 h-6 text-amber-600" />} label="Needs device check-in" value={liveSession ? students.length - checkedIn.length : 'Start session'} /></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-2xl border shadow-sm"><h3 className="text-lg font-bold mb-1">Recorded learner progress</h3><p className="text-sm text-neutral-500 mb-4">Percent of currently available lessons completed.</p><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={progressRows}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" hide /><YAxis domain={[0, 100]} unit="%" /><Tooltip /><Bar dataKey="progress" name="Recorded progress" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div><div className="bg-white p-6 rounded-2xl border shadow-sm"><h3 className="text-lg font-bold mb-1">Recorded points</h3><p className="text-sm text-neutral-500 mb-4">Points are activity records, not an attention measure.</p><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={progressRows}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Line type="monotone" dataKey="points" name="Recorded points" stroke="#3b82f6" strokeWidth={3} /></LineChart></ResponsiveContainer></div></div></div>
    <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h3 className="text-lg font-bold">Live wearable check-in</h3><p className="text-sm text-neutral-500">Real BLE heart-rate packets only. Heart rate does not determine attention, fatigue, or a medical condition.</p></div><button onClick={() => setLiveSession(value => !value)} className={`px-4 py-2 rounded-lg font-bold ${liveSession ? 'bg-red-50 text-red-700' : 'bg-indigo-600 text-white'}`}><Radio className="inline w-4 h-4 mr-1" />{liveSession ? 'End live session' : 'Start live session'}</button></div>{liveSession && <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">{students.map(student => { const reading = latestByStudent.get(student.id); const isCheckedIn = checkedIn.some(item => item.id === student.id); return <div key={student.id} className="p-4 border rounded-xl flex justify-between"><div><p className="font-semibold">{student.name}</p><p className="text-sm text-neutral-500">{isCheckedIn ? `Latest verified reading: ${reading?.bpm} bpm` : 'Needs a teacher check-in: no verified reading in the last 5 minutes.'}</p></div><span className={`text-sm font-bold ${isCheckedIn ? 'text-emerald-600' : 'text-amber-700'}`}>{isCheckedIn ? 'Checked in' : 'Check-in needed'}</span></div>; })}</div>}</div>
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden"><div className="p-6 border-b"><h3 className="text-lg font-bold">Student roster</h3></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-neutral-50"><tr><th className="px-6 py-4 text-xs font-bold uppercase">Student name</th><th className="px-6 py-4 text-xs font-bold uppercase">Points</th><th className="px-6 py-4 text-xs font-bold uppercase">Level</th><th className="px-6 py-4 text-xs font-bold uppercase">Action</th></tr></thead><tbody>{students.map(student => <tr key={student.id} className="border-t hover:bg-neutral-50"><td className="px-6 py-4 font-medium text-blue-600">{student.name}</td><td className="px-6 py-4">{student.points || 0}</td><td className="px-6 py-4">{student.level || 1}</td><td className="px-6 py-4"><button onClick={() => navigate(`/teacher/students/${student.id}`)} className="text-sm font-medium text-blue-600">View report</button></td></tr>)}</tbody></table></div></div>
  </div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) { return <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4"><div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center">{icon}</div><div><p className="text-sm font-medium text-neutral-500">{label}</p><p className="text-2xl font-bold text-neutral-800">{value}</p></div></div>; }
