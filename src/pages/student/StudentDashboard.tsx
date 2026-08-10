import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { studentMetrics, gamification } from '../../data/mockData';
import { Trophy, Star, Zap, Headset, PlayCircle, CheckCircle, Clock, Search, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import VoiceInput from '../../components/shared/VoiceInput';
import Badges from '../../components/shared/Badges';

const progressData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  score: Math.round(75 + Math.random() * 20),
  completion: Math.round(10 + (i * 3) + Math.random() * 5),
}));

export default function StudentDashboard() {
  const { currentUser, courses, completedLessons, earnedBadges } = useAppContext();
  const navigate = useNavigate();
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

  // Find the first course for the demo
  const course = courses[0];

  // New accounts may not have any Firestore courses yet. Do not attempt to
  // access lessons until a teacher has published a course.
  if (!course || !course.lessons?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Learner'}!</h2>
          <p className="text-neutral-500">Your learning space is ready.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm text-center">
          <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-neutral-800">Courses are coming soon</h3>
          <p className="text-neutral-500 mt-2 max-w-md mx-auto">
            There are no published courses available yet. Please check back after your teacher adds one.
          </p>
        </div>
      </div>
    );
  }
  
  // Calculate progress
  const totalLessons = course.lessons.length;
  const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  
  // Find next lesson
  const nextLesson = course.lessons.find(l => !completedLessons.includes(l.id)) || course.lessons[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Welcome back, {currentUser?.name?.split(' ')[0]}!</h2>
          <p className="text-neutral-500">Here's your learning progress today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-neutral-700">{currentUser?.points || 0} pts</span>
          </div>
          <div className="w-px h-6 bg-neutral-200"></div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-neutral-700">Lvl {currentUser?.level || 1}</span>
          </div>
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
              placeholder="Ask anything about your courses..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main CTA */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 mb-1">Up Next: {nextLesson.title}</h3>
              <p className="text-neutral-500 text-sm mb-4">Course: {course.title}</p>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-sm font-bold text-neutral-700">{progressPercent}%</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/student/courses/${course.id}/lessons/${nextLesson.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Continue Learning
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mt-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-4">30-Day Performance Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="Test Score" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="completion" name="Completion %" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Adaptive Learning Pathway</h3>
                <p className="text-sm text-neutral-500">AI-curated modules based on your learning style.</p>
              </div>
            </div>
            <div className="space-y-4">
              {course.lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isNext = lesson.id === nextLesson.id;
                
                return (
                  <div 
                    key={lesson.id} 
                    onClick={() => navigate(`/student/courses/${course.id}/lessons/${lesson.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-blue-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isNext ? 'bg-blue-100 text-blue-600' :
                        'bg-neutral-200 text-neutral-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                         isNext ? <PlayCircle className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                        <p className="text-xs font-medium text-neutral-500 capitalize">{lesson.type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Headset className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded-md text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                Immersive Lab
              </span>
              <h3 className="text-xl font-bold mb-2">Join VR Group Session</h3>
              <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                Collaborate with peers in the virtual chemistry lab for your upcoming assignment.
              </p>
              <button 
                onClick={() => navigate('/student/labs')}
                className="w-full bg-white text-indigo-900 font-bold py-3 px-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Headset className="w-5 h-5" />
                Launch VR Environment
              </button>
            </div>
          </div>

          <Badges earnedBadges={earnedBadges} />
        </div>
      </div>
    </div>
  );
}
