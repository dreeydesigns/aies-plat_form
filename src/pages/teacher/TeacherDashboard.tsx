import React, { useState } from 'react';
import { AlertCircle, UserCheck, TrendingUp, Settings, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import VoiceInput from '../../components/shared/VoiceInput';

const performanceData = [
  { day: 'Mon', avgScore: 78, engagement: 82 },
  { day: 'Tue', avgScore: 82, engagement: 85 },
  { day: 'Wed', avgScore: 80, engagement: 79 },
  { day: 'Thu', avgScore: 85, engagement: 88 },
  { day: 'Fri', avgScore: 89, engagement: 91 },
];

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  hoursSpent: Math.round((1 + Math.random() * 3) * 10) / 10,
  avgQuizScore: Math.round(70 + Math.random() * 25),
}));

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { users } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult('');
    setSearchSources([]);
    try {
      const response = await fetch('/api/gemini/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.error) {
        setSearchResult(`Error: ${data.error}`);
      } else {
        setSearchResult(data.result);
        if (data.sources) {
          setSearchSources(data.sources);
        }
      }
    } catch (error) {
      setSearchResult("Failed to fetch resources. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Teacher Overview</h2>
          <p className="text-neutral-500">Monitor student engagement and adapt learning pathways.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-800 mb-4">Search Educational Resources</h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for teaching materials, articles, or resources..."
              className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
            <div className="absolute right-2 top-2">
              <VoiceInput onTranscript={(text) => setSearchQuery(prev => prev + ' ' + text)} />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
        {searchResult && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">
            {searchResult}
            {searchSources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="font-semibold text-neutral-800 mb-2">Verified Sources:</h4>
                <ul className="space-y-2">
                  {searchSources.map((source, index) => (
                    <li key={index}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Students</p>
            <p className="text-2xl font-bold text-neutral-800">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Avg Engagement</p>
            <p className="text-2xl font-bold text-neutral-800">82%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Fatigue Alerts</p>
            <p className="text-2xl font-bold text-neutral-800">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">30-Day Performance Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} minTickGap={30} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="avgQuizScore" name="Avg Score %" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="hoursSpent" name="Hours Spent" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Class Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="avgScore" name="Avg Score %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Class Engagement Heatmap</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f5f5f5' }}
                />
                <Bar dataKey="engagement" name="Engagement Level" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-800">Student Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {students.map(student => (
                <tr 
                  key={student.id} 
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => navigate(`/teacher/students/${student.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-blue-600 hover:underline">{student.name}</td>
                  <td className="px-6 py-4 font-bold text-neutral-700">{student.points || 0}</td>
                  <td className="px-6 py-4 text-neutral-600">{student.level || 1}</td>
                  <td className="px-6 py-4 text-neutral-600">{student.streak || 0} days</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/teacher/students/${student.id}`);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Report
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
