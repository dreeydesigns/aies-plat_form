import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { SAT_DISCLAIMER } from '../../../utils/concordance';
import { 
  Award, 
  Clock, 
  Calculator, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ShieldAlert,
  Lock,
  Unlock
} from 'lucide-react';

export default function SatPracticeTests() {
  const { userProfile } = useAppContext();
  const navigate = useNavigate();

  // Spec v3 Section 10: Unlock condition (3 consecutive Hard-tier questions cleared or diagnostic completed)
  const mathConsecutive = userProfile?.satProfile?.consecutiveHardCorrect?.math || 0;
  const rwConsecutive = userProfile?.satProfile?.consecutiveHardCorrect?.rw || 0;
  const isDiagnosticDone = userProfile?.satProfile?.diagnosticCompleted || userProfile?.satProfile?.placementByDomain !== undefined;

  const handleStartTest = (mode: 'math' | 'english' | 'full') => {
    navigate(`/student/sat/test-runner?mode=${mode}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 font-sans">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          Timed Exam Simulation
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Full-Length SAT Practice Tests
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base">
          Experience authentic timed test modules, Flag-for-Review navigation, embedded Desmos grapher, and scaled score estimates.
        </p>
      </div>

      {/* Test Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Full SAT Test */}
        <div className="bg-white rounded-3xl p-6 border-2 border-blue-600 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
            Full Simulation
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Full SAT Exam</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Complete 4-module test: 2 Reading & Writing modules (32 min each) + 10-minute break + 2 Math modules (35 min each).
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-500 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> 134 min + 10 min break
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" /> 400 – 1600 Total Score
              </div>
            </div>
          </div>
          <button
            onClick={() => handleStartTest('full')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Start Full Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Math Only */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Math Section Only</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              2 timed modules (35 min / 22 questions each) covering all 4 math domains with embedded Desmos graphing calculator.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-500 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> 70 minutes (44 items)
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" /> 200 – 800 Math Score
              </div>
            </div>
          </div>
          <button
            onClick={() => handleStartTest('math')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black font-bold text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Start Math Only</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reading & Writing Only */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Reading & Writing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              2 timed modules (32 min / 27 questions each) covering information, craft, expression of ideas, and conventions.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-500 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> 64 minutes (54 items)
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> 200 – 800 RW Score
              </div>
            </div>
          </div>
          <button
            onClick={() => handleStartTest('english')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black font-bold text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Start Reading & Writing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Disclaimer Card */}
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
