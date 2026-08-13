import React from 'react';
import { Calculator, BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface SubjectChoiceModalProps {
  onSelectSubject: (section: 'math' | 'reading-writing') => void;
  completedSections?: { math?: boolean; readingWriting?: boolean };
}

export default function SubjectChoiceModal({
  onSelectSubject,
  completedSections = {}
}: SubjectChoiceModalProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-8 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          Adaptive Placement Engine
        </div>
        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
          Choose Your Starting Subject
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Take a 2-stage adaptive diagnostic to establish your baseline placement across all official College Board domains.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
        {/* Math Card */}
        <div
          onClick={() => onSelectSubject('math')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-lg group ${
            completedSections.math
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-neutral-200 hover:border-blue-500 bg-neutral-50/50 hover:bg-blue-50/20'
          }`}
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
              📐
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors">
                  Digital Math
                </h3>
                {completedSections.math && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry & Trigonometry.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>~20 minutes (2 modules)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Reading & Writing Card */}
        <div
          onClick={() => onSelectSubject('reading-writing')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-lg group ${
            completedSections.readingWriting
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-neutral-200 hover:border-indigo-500 bg-neutral-50/50 hover:bg-indigo-50/20'
          }`}
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
              📖
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  Reading & Writing
                </h3>
                {completedSections.readingWriting && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Information & Ideas, Craft & Structure, Expression of Ideas, Standard English Conventions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>~20 minutes (2 modules)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        You can take the other diagnostic anytime. This sets your initial starting placement.
      </p>
    </div>
  );
}
