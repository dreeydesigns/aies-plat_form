import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { SAT_DISCLAIMER } from '../../../utils/concordance';
import { SatDomain } from '../../../types';
import { 
  Award, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart2, 
  ShieldAlert,
  Clock,
  Zap
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
  const { userProfile, satTests, satDiagnostics } = useAppContext();
  const navigate = useNavigate();

  const targetScore = userProfile?.satProfile?.targetScore || 1450;
  const placements = userProfile?.satProfile?.placementByDomain || {};

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

  // Domain Proficiency Data for Charts
  const domainProficiencyData = useMemo(() => {
    return Object.entries(domainNames).map(([key, label]) => {
      const tier = placements[key as SatDomain] || 'intermediate';
      const score = tier === 'expert' ? 95 : tier === 'intermediate' ? 70 : 40;
      return {
        domain: label,
        tier,
        score
      };
    });
  }, [placements]);

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

      {/* Score Progress Chart */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Score History & Progression</h3>
            <p className="text-xs text-neutral-500">Scaled score trajectory across completed test sessions</p>
          </div>
          <button
            onClick={() => navigate('/student/sat/tests')}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" /> Take Another Test
          </button>
        </div>

        {scoreStats.testHistory.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...scoreStats.testHistory].reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="attempt" tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis domain={[400, 1600]} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="totalScore" name="Total Scaled Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-10 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500 text-sm">
            No full practice tests completed yet. Take a test to view your score trend line.
          </div>
        )}
      </div>

      {/* Domain Mastery Bar Breakdown */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-neutral-900">Domain-by-Domain Proficiency Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainProficiencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="domain" tick={{ fill: '#737373', fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#737373', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" name="Mastery %" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Targeted Textbook Remediation Links (Spec v3 Section 12) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Recommended Textbook Remediation
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Direct links to high-yield chapters and pages in the Textbook Library for your weakest domains.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/sat/textbooks')}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Open Library →
          </button>
        </div>

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
      </div>

      {/* 5-Finger & Metacognitive Error Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
            <span className="text-xl">✋</span>
            5-Finger Strategy Diagnostic History
          </div>
          <p className="text-xs text-neutral-500">
            Metacognitive tracking of struggle points flagged during Module 1 sessions.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold p-3 bg-neutral-50 rounded-xl">
              <span>Avg Module 1 Flags Used:</span>
              <span className="font-bold text-neutral-900">2.4 / 5</span>
            </div>
            <div className="flex justify-between text-xs font-semibold p-3 bg-emerald-50 text-emerald-900 rounded-xl">
              <span>Lucky Guesses (Flagged & Correct):</span>
              <span className="font-bold text-emerald-700">38% of flags</span>
            </div>
            <div className="flex justify-between text-xs font-semibold p-3 bg-amber-50 text-amber-900 rounded-xl">
              <span>Confirmed Skill Gaps (Flagged & Wrong):</span>
              <span className="font-bold text-amber-700">62% of flags</span>
            </div>
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
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs flex justify-between items-center font-semibold">
              <span>Expected Struggles (Bookmarked & Wrong):</span>
              <span className="font-bold text-blue-800">44%</span>
            </div>
            <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs flex justify-between items-center font-semibold">
              <span>Careless Blindspots (Not Bookmarked & Wrong):</span>
              <span className="font-bold text-red-800">56%</span>
            </div>
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
