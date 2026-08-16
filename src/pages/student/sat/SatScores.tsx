import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { SAT_DISCLAIMER } from '../../../utils/concordance';
import { SatDomain } from '../../../types';
import { 
  Award, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart2, 
  ShieldAlert,
  Clock,
  Zap,
  Hand,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const domainNames: Record<SatDomain, string> = {
  'algebra': 'Algebra',
  'advanced-math': 'Advanced Math',
  'problem-solving-data-analysis': 'Data & Problem Solving',
  'geometry-trigonometry': 'Geometry & Trig',
  'information-ideas': 'Information & Ideas',
  'craft-structure': 'Craft & Structure',
  'expression-of-ideas': 'Expression of Ideas',
  'standard-english-conventions': 'Standard Conventions'
};

export default function SatScores() {
  const { userProfile, satTests = [], satDiagnostics = [] } = useAppContext();
  const navigate = useNavigate();

  const targetScore = userProfile?.satProfile?.targetScore || 1450;
  const placements = userProfile?.satProfile?.placementByDomain || {};
  const hasCompletedDiagnostic = !!userProfile?.satProfile?.diagnosticCompleted || satDiagnostics.length > 0;

  // Find highest & latest scores
  const scoreStats = useMemo(() => {
    if (!satTests || satTests.length === 0) {
      return {
        highest: 0,
        latest: 0,
        mathAvg: 0,
        rwAvg: 0,
        testHistory: []
      };
    }

    let highest = 0;
    const history = satTests.map((t, idx) => {
      const mathSections = t.sections.filter(s => s.section === 'math');
      const rwSections = t.sections.filter(s => s.section === 'reading-writing');

      const mathScore = mathSections.length > 0
        ? Math.round(mathSections.reduce((acc, s) => acc + (s.estimatedScaledScore || 200), 0) / mathSections.length)
        : 0;

      const rwScore = rwSections.length > 0
        ? Math.round(rwSections.reduce((acc, s) => acc + (s.estimatedScaledScore || 200), 0) / rwSections.length)
        : 0;

      const total = t.totalEstimatedScore || (mathScore + rwScore);
      if (total > highest) highest = total;

      return {
        testId: t.id,
        attempt: `Test #${satTests.length - idx}`,
        date: t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'Recent',
        mode: t.mode,
        mathScore,
        rwScore,
        totalScore: total
      };
    });

    const latest = history[0]?.totalScore || 0;
    const validMath = history.filter(h => h.mathScore > 0);
    const validRW = history.filter(h => h.rwScore > 0);

    const mathAvg = validMath.length ? Math.round(validMath.reduce((a, b) => a + b.mathScore, 0) / validMath.length) : 0;
    const rwAvg = validRW.length ? Math.round(validRW.reduce((a, b) => a + b.rwScore, 0) / validRW.length) : 0;

    return {
      highest,
      latest,
      mathAvg,
      rwAvg,
      testHistory: history
    };
  }, [satTests]);

  // Domain Proficiency Data for Charts (0 if unassessed)
  const domainProficiencyData = useMemo(() => {
    if (!hasCompletedDiagnostic && Object.keys(placements).length === 0) {
      return [];
    }

    return Object.entries(domainNames).map(([key, label]) => {
      const tier = placements[key as SatDomain];
      const score = tier === 'expert' ? 95 : tier === 'intermediate' ? 70 : tier === 'beginner' ? 40 : 0;
      return {
        domain: label,
        tier: tier || 'Unassessed',
        score
      };
    });
  }, [placements, hasCompletedDiagnostic]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-blue-200">
          <TrendingUp className="w-3.5 h-3.5" />
          Official SAT Concordance Engine
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Score Reports & Analytics
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Detailed breakdown of your scaled score projections, domain placements, and test performance trends.
        </p>
      </div>

      {/* Target Score & Current Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Target Score</p>
            <h3 className="text-3xl font-black text-neutral-900 mt-1">{targetScore}</h3>
          </div>
          <p className="text-[11px] text-blue-600 font-bold mt-3 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Aiming for 95th+ percentile
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Highest Estimated</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">
              {scoreStats.highest > 0 ? scoreStats.highest : '—'}
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            {scoreStats.highest > 0 ? `${targetScore - scoreStats.highest > 0 ? `${targetScore - scoreStats.highest} pts to goal` : 'Goal achieved!'}` : 'Complete a practice test'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Math Scaled Avg</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-1">
              {scoreStats.mathAvg > 0 ? scoreStats.mathAvg : '—'}
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">Scaled score / 800</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Reading & Writing Avg</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">
              {scoreStats.rwAvg > 0 ? scoreStats.rwAvg : '—'}
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">Scaled score / 800</p>
        </div>
      </div>

      {/* Score History & Progression */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Score History & Progression</h3>
            <p className="text-xs text-neutral-500">Scaled score trajectory across completed test sessions</p>
          </div>
          <button
            onClick={() => navigate('/student/sat/practice')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            Take Practice Test
          </button>
        </div>

        {scoreStats.testHistory.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center bg-neutral-50 rounded-2xl border border-neutral-100 text-center p-6 space-y-2">
            <p className="text-xs text-neutral-500">
              No full practice tests completed yet. Take a test to view your score trend line.
            </p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreStats.testHistory.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="attempt" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis domain={[400, 1600]} axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Line type="monotone" dataKey="totalScore" name="Total Scaled Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Domain Proficiency Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Domain-by-Domain Proficiency Breakdown</h3>
          <p className="text-xs text-neutral-500">Mastery calibration across the 8 official Digital SAT domains</p>
        </div>

        {domainProficiencyData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center bg-neutral-50 rounded-2xl border border-neutral-100 text-center p-6 space-y-2">
            <BarChart2 className="w-8 h-8 text-neutral-300" />
            <p className="text-sm font-semibold text-neutral-700">No Diagnostic Calibration Data Yet</p>
            <p className="text-xs text-neutral-500 max-w-sm">
              Complete your diagnostic trial exam to calibrate your skills across all 8 SAT domains.
            </p>
            <button
              onClick={() => navigate('/student/sat/diagnostic')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start Diagnostic Exam
            </button>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainProficiencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  formatter={(val: any, _name: any, item: any) => [`${val}% (${item.payload.tier} Tier)`, 'Estimated Mastery']}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recommended Textbook Remediation */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Recommended Textbook Remediation
          </div>
          <button 
            onClick={() => navigate('/student/sat/textbooks')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Open Library <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!hasCompletedDiagnostic ? (
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Personalized textbook remediation recommendations will generate automatically after your diagnostic trial.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div
              onClick={() => navigate('/student/sat/textbooks?book=sat-foundations-math&page=1')}
              className="p-4 bg-neutral-50 hover:bg-blue-50 border border-neutral-200 hover:border-blue-300 rounded-2xl cursor-pointer transition-all space-y-1 group"
            >
              <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Algebra</span>
              <p className="text-xs font-bold text-neutral-900 group-hover:text-blue-700">Linear Systems & Slope-Intercept</p>
              <p className="text-[11px] text-neutral-500">Foundations of SAT Math · Page 1</p>
            </div>

            <div
              onClick={() => navigate('/student/sat/textbooks?book=sat-grammar-conventions&page=1')}
              className="p-4 bg-neutral-50 hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 rounded-2xl cursor-pointer transition-all space-y-1 group"
            >
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Conventions</span>
              <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">Sentence Boundaries & Semicolons</p>
              <p className="text-[11px] text-neutral-500">Standard English Conventions · Page 1</p>
            </div>

            <div
              onClick={() => navigate('/student/sat/textbooks?book=sat-advanced-math-mastery&page=1')}
              className="p-4 bg-neutral-50 hover:bg-purple-50 border border-neutral-200 hover:border-purple-300 rounded-2xl cursor-pointer transition-all space-y-1 group"
            >
              <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Advanced Math</span>
              <p className="text-xs font-bold text-neutral-900 group-hover:text-purple-700">Nonlinear Systems & Quadratics</p>
              <p className="text-[11px] text-neutral-500">SAT Advanced Math Mastery · Page 1</p>
            </div>
          </div>
        )}
      </div>

      {/* 5-Finger & Metacognitive Error Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
            <Hand className="w-5 h-5 text-purple-600" />
            5-Finger Strategy Diagnostic History
          </div>
          <p className="text-xs text-neutral-500">
            Metacognitive tracking of struggle points flagged during Module 1 sessions.
          </p>
          
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center space-y-1">
            <p className="text-xs font-bold text-neutral-700">No Metacognitive Flags Stored Yet</p>
            <p className="text-[11px] text-neutral-500">
              When you flag hard questions with the 5-Finger Struggle tool in Module 1, your accuracy on flagged vs unflagged questions will render here.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
            <Target className="w-5 h-5 text-indigo-600" />
            Error Categorization Matrix
          </div>
          <p className="text-xs text-neutral-500">
            Comparing bookmarked struggles against unbookmarked blind spots.
          </p>

          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center space-y-1">
            <p className="text-xs font-bold text-neutral-700">No Error Distribution Data</p>
            <p className="text-[11px] text-neutral-500">
              After submitting timed practice tests, careless blindspots vs expected struggles will be categorized here.
            </p>
          </div>
        </div>
      </div>

      {/* Test History Log Table */}
      {scoreStats.testHistory.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Completed Test Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="pb-3">Session</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Math Score</th>
                  <th className="pb-3">RW Score</th>
                  <th className="pb-3">Total Estimated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {scoreStats.testHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 font-bold text-neutral-900">{item.attempt}</td>
                    <td className="py-3.5 text-neutral-600">{item.date}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-neutral-100 text-neutral-700">
                        {item.mode}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-indigo-600">{item.mathScore > 0 ? item.mathScore : '—'}</td>
                    <td className="py-3.5 font-bold text-emerald-600">{item.rwScore > 0 ? item.rwScore : '—'}</td>
                    <td className="py-3.5 font-black text-neutral-900 text-base">{item.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer Card */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Official Disclaimer: </span>
          {SAT_DISCLAIMER} SAT® is a registered trademark of the College Board, which is not affiliated with and does not endorse this platform.
        </div>
      </div>
    </div>
  );
}
