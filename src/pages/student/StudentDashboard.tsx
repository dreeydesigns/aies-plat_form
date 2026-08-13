import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { SatDomain } from '../../types';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Zap, 
  Layers, 
  BookOpen, 
  BarChart3, 
  Target, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Loader2, 
  Send,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import VoiceInput from '../../components/shared/VoiceInput';
import Badges from '../../components/shared/Badges';

const domainNames: Record<SatDomain, { name: string; section: 'math' | 'reading-writing' }> = {
  'algebra': { name: 'Algebra', section: 'math' },
  'advanced-math': { name: 'Advanced Math', section: 'math' },
  'problem-solving-data-analysis': { name: 'Problem-Solving & Data', section: 'math' },
  'geometry-trigonometry': { name: 'Geometry & Trig', section: 'math' },
  'information-ideas': { name: 'Information & Ideas', section: 'reading-writing' },
  'craft-structure': { name: 'Craft & Structure', section: 'reading-writing' },
  'expression-of-ideas': { name: 'Expression of Ideas', section: 'reading-writing' },
  'standard-english-conventions': { name: 'Standard English', section: 'reading-writing' }
};

export default function StudentDashboard() {
  const { userProfile, earnedBadges, assignedTests } = useAppContext();
  const navigate = useNavigate();

  // Search Assistant state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const satProfile = userProfile?.satProfile;
  const placements = satProfile?.placementByDomain || {};
  const targetScore = satProfile?.targetScore || 1450;
  const targetTestDate = satProfile?.targetTestDate || '';

  // Calculate days remaining to target test date
  const daysToTest = targetTestDate ? Math.max(0, Math.ceil((new Date(targetTestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 45;

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
      setSearchResult("Failed to fetch educational resources. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'Scholar'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Digital SAT Preparation Command Center · Adaptive Practice & Mastery Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-white p-2.5 px-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-neutral-800 text-sm">{userProfile?.points || 0} pts</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-neutral-800 text-sm">{userProfile?.streak || 1} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main SAT Target & Readiness Hero Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-300 rounded-full text-xs font-extrabold uppercase tracking-wider border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Digital SAT Adaptive Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Target Score: {targetScore} / 1600
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {satProfile?.diagnosticCompleted
                ? `Your baseline placement is active. Complete daily adaptive practice to turn your intermediate domains into expert tiers before test day.`
                : `Take the official 2-stage adaptive diagnostic to establish your exact placement across all 8 SAT domains.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 flex-shrink-0">
            {!satProfile?.diagnosticCompleted ? (
              <button
                onClick={() => navigate('/student/sat/diagnostic')}
                className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Diagnostic Test
              </button>
            ) : (
              <button
                onClick={() => navigate('/student/sat/practice')}
                className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Launch Practice Studio
              </button>
            )}

            <button
              onClick={() => navigate('/student/sat/tests')}
              className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-white text-sm transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Test Center
            </button>
          </div>
        </div>

        {/* Target Countdown Widget */}
        <div className="pt-4 border-t border-neutral-700/60 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Target Test Date: <strong className="text-white">{targetTestDate || 'Upcoming Sitting'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Countdown: <strong className="text-amber-300">{daysToTest} days remaining</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Status: <strong className="text-emerald-300">{satProfile?.diagnosticCompleted ? 'Calibrated' : 'Diagnostic Pending'}</strong></span>
          </div>
        </div>
      </div>

      {/* Teacher Assigned Tests Notification Card (if any) */}
      {assignedTests && assignedTests.length > 0 && (
        <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Assigned SAT Workouts from Teachers ({assignedTests.length})
            </h3>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedTests.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                      {t.testConfig.section === 'math' ? 'Math Workout' : 'Reading & Writing'}
                    </span>
                    {t.dueDate && <span className="text-[11px] text-neutral-500 font-semibold">Due: {t.dueDate}</span>}
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm mt-2">
                    {t.testConfig.domain ? `Focused Domain: ${t.testConfig.domain}` : 'Comprehensive Adaptive Practice'}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Assigned by {t.assignedByTeacherName || 'Teacher'}</p>
                </div>

                <button
                  onClick={() => navigate(`/student/sat/practice?domain=${t.testConfig.domain || 'algebra'}`)}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Launch Assigned Workout
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8-Domain Mastery Status Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">8 Official SAT Domains Mastery</h3>
            <p className="text-xs text-neutral-500">Your current adaptive difficulty rating by domain</p>
          </div>
          <button
            onClick={() => navigate('/student/sat/practice')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Practice Any Domain <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(domainNames) as SatDomain[]).map((domainKey) => {
            const info = domainNames[domainKey];
            const tier = placements[domainKey] || 'intermediate';

            return (
              <div
                key={domainKey}
                onClick={() => navigate(`/student/sat/practice?domain=${domainKey}`)}
                className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                      {info.section === 'math' ? 'Math' : 'Reading & Writing'}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        tier === 'expert'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tier === 'beginner'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tier}
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-base mt-2 group-hover:text-blue-600 transition-colors">
                    {info.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-2 border-t border-neutral-100">
                  <span>Start Drills</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Studio Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-neutral-900 text-lg">Practice & Prepare</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Adaptive weighted question streams with instant explanation & textbook deep-linking.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/sat/practice')}
            className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            Launch Practice Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Textbooks Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-neutral-900 text-lg">Curated Textbooks</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Official remediation library with page & line highlight reader for wrong answers.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/sat/textbooks')}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            Open Textbook Reader <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Score Reports Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-neutral-900 text-lg">Score Reports</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Concordance scaled projections (400–1600), section breakdowns, and progress curves.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/sat/scores')}
            className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            View Full Score Reports <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Grounded SAT Research Assistant */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold text-lg">
          <Search className="w-5 h-5 text-blue-600" />
          AI Grounded SAT Research & Concept Assistant
        </div>
        <p className="text-xs text-neutral-500">
          Ask questions about tricky math formulas, grammatical rules, or test taking strategies.
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. How do I solve quadratic system intersections? or Rules for semicolons..."
              className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-6 py-3 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl disabled:opacity-50 text-sm transition-colors"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask AI'}
          </button>
        </div>

        {searchResult && (
          <div className="mt-4 p-5 bg-neutral-50 rounded-2xl text-sm whitespace-pre-wrap border border-neutral-200 leading-relaxed text-neutral-800">
            {searchResult}
            {searchSources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-200">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Grounded Sources:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {searchSources.map((source, index) => (
                    <li key={index}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
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

      {/* Badges and Rewards Section */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <Badges earnedBadges={earnedBadges} />
      </div>
    </div>
  );
}
