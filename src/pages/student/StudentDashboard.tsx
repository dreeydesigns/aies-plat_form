import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Trophy, Star, Zap, Headset, PlayCircle, CheckCircle, Clock, Search, Loader2, BookOpen, AlertCircle, RefreshCw, Sparkles, Smile, GraduationCap, Repeat, Flame } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAgeTier } from '../../context/AgeTierContext';
import { Link, useNavigate } from 'react-router-dom';
import VoiceInput from '../../components/shared/VoiceInput';
import Badges from '../../components/shared/Badges';

const progressData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  score: Math.round(75 + Math.random() * 20),
  completion: Math.round(10 + (i * 3) + Math.random() * 5),
}));

export default function StudentDashboard() {
  const { currentUser, userProfile, courses, completedLessons, earnedBadges, retakePrompts, submissions } = useAppContext();
  const { ageTier, setAgeTier, isKids, isAdult } = useAgeTier();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const pendingPrompts = retakePrompts.filter(p => p.studentId === userProfile?.id && p.status === 'pending');
  const mySubmissions = submissions.filter(s => s.studentId === userProfile?.id);

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

  const primaryCourse = courses[0];

  if (!primaryCourse || !primaryCourse.lessons?.length) {
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

  const totalLessons = primaryCourse.lessons.length;
  const completedCount = primaryCourse.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  const nextLesson = primaryCourse.lessons.find(l => !completedLessons.includes(l.id)) || primaryCourse.lessons[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Age Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold ${isKids ? 'text-purple-900 font-sans' : 'text-neutral-900'}`}>
            {isKids ? `🌟 Hi, ${userProfile?.name?.split(' ')[0]}! Ready for an Adventure?` : `Welcome back, ${userProfile?.name?.split(' ')[0]}`}
          </h2>
          <p className="text-neutral-500 text-sm">
            {isKids ? 'Complete fun quests, earn badges, and explore 3D worlds!' : 'Adaptive Learning OS · Performance Metrics & Syllabus Progress'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Age Tier Selector Pill */}
          <div className="flex items-center bg-white border border-neutral-200 p-1 rounded-2xl shadow-xs">
            <button
              onClick={() => setAgeTier('kids')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                isKids ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> Kids Mode
            </button>
            <button
              onClick={() => setAgeTier('youth')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                ageTier === 'youth' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> High School
            </button>
            <button
              onClick={() => setAgeTier('adult')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                isAdult ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> College / Adult
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white p-2.5 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-neutral-800 text-sm">{userProfile?.points || 0} pts</span>
            </div>
            <div className="w-px h-5 bg-neutral-200"></div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-neutral-800 text-sm">{userProfile?.streak || 1} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Retake Requests / Action Required Card */}
      {pendingPrompts.length > 0 && (
        <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Action Required: Teacher Retake Requests ({pendingPrompts.length})
          </div>
          <div className="space-y-3">
            {pendingPrompts.map(prompt => {
              const targetCourse = courses.find(c => c.id === prompt.courseId || c.lessons.some(l => l.id === prompt.lessonId || l.quizId === prompt.targetId));
              const targetLesson = targetCourse?.lessons.find(l => l.id === prompt.lessonId || l.quizId === prompt.targetId);

              return (
                <div key={prompt.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-neutral-900">{prompt.targetTitle}</span>
                      <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                        Requested by Teacher {prompt.teacherName}
                      </span>
                    </div>
                    {prompt.note && (
                      <p className="text-sm text-neutral-600 italic mt-1">"{prompt.note}"</p>
                    )}
                  </div>
                  {targetCourse && targetLesson ? (
                    <button
                      onClick={() => navigate(`/student/courses/${targetCourse.id}/lessons/${targetLesson.id}?retakePromptId=${prompt.id}&mode=quiz`)}
                      className="px-5 py-2.5 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retake Exam Now
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/student/courses')}
                      className="px-5 py-2.5 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      Go to Courses
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KIDS MODE VIEW: Colorful, Gamified Quests & Fun UI */}
      {isKids && (
        <div className="space-y-6">
          {/* Main Quest Hero Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl z-10">
              <span className="bg-white/20 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full border border-white/20 inline-block">
                🚀 Today's Main Quest
              </span>
              <h3 className="text-3xl font-extrabold">{nextLesson.title}</h3>
              <p className="text-purple-100 text-sm">
                Explore the lesson, complete the quick challenge, and earn +{primaryCourse.lessons.length * 50} points!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate(`/student/courses/${primaryCourse.id}/lessons/${nextLesson.id}`)}
                  className="px-8 py-3.5 bg-white text-purple-900 font-extrabold rounded-2xl shadow-lg hover:bg-purple-50 transition-transform active:scale-95 flex items-center gap-2 text-base"
                >
                  <PlayCircle className="w-6 h-6 text-purple-600" />
                  Start Quest Now
                </button>
              </div>
            </div>

            <div className="w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center text-6xl shadow-inner border border-white/20">
              🎉
            </div>
          </div>

          {/* Gamified Badges & Badges Row */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
            <Badges earnedBadges={earnedBadges} />
          </div>
        </div>
      )}

      {/* ADULT / UNIVERSITY / HIGH SCHOOL HIGH-TECH MODE VIEW */}
      {!isKids && (
        <div className="space-y-6">
          {/* High-Tech Syllabus & Course Hero */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
                  Syllabus Progression
                </span>
                <span className="text-xs text-neutral-400 font-mono">{completedCount} of {totalLessons} Modules Complete</span>
              </div>
              <h3 className="text-3xl font-bold">{primaryCourse.title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{primaryCourse.description}</p>
              
              <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden border border-neutral-700">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/student/courses/${primaryCourse.id}/lessons/${nextLesson.id}`)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm flex-shrink-0"
            >
              <PlayCircle className="w-5 h-5" />
              Continue Next Module
            </button>
          </div>

          {/* Spaced Repetition Daily Memory Deck */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-indigo-600" />
                  Spaced Repetition Memory Deck
                </h3>
                <p className="text-xs text-neutral-500">SM-2 algorithm scheduled concept reviews to maximize retention.</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                {completedLessons.length} Concepts Tracked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {primaryCourse.lessons.slice(0, 3).map((l, idx) => (
                <div key={l.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Concept #{idx + 1}</span>
                    <h4 className="font-bold text-neutral-900 text-sm mt-1">{l.title}</h4>
                  </div>
                  <button
                    onClick={() => navigate(`/student/courses/${primaryCourse.id}/lessons/${l.id}`)}
                    className="w-full py-2 bg-white border border-neutral-300 text-neutral-800 font-bold text-xs rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    Quick Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Grounded Educational Search Assistant */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              AI Grounded Educational Research Assistant
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles, research papers, or syllabus explanations..."
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
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl disabled:opacity-50 text-sm"
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
        </div>
      )}
    </div>
  );
}
