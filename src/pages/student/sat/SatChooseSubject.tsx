import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SatChooseSubject() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleStart = () => {
    if (!selectedSubject) return;
    navigate(`/student/sat/preview-runner?subject=${selectedSubject}`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-xl max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Choose subject
          </h1>
          <p className="text-neutral-500 text-sm">
            Select the section you would like to explore in this preview.
          </p>
        </div>

        {/* Required Dropdown Selection per Spec v3 Page 5 */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
            Subject <span className="text-blue-600">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl text-sm font-bold text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a subject to preview...
              </option>
              <option value="math">Math</option>
              <option value="reading-writing">Reading & Writing</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Context Card for Selected Subject */}
          {selectedSubject === 'math' && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
              <Calculator className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Algebra, Advanced Math, Problem-Solving, Geometry & Trig with embedded Desmos calculator.</span>
            </div>
          )}
          {selectedSubject === 'reading-writing' && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
              <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Information & Ideas, Craft & Structure, Expression of Ideas, and Standard English Conventions.</span>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/student/sat/preview-intro')}
            className="py-4 px-6 rounded-2xl border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-50 text-sm transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={!selectedSubject}
            className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-extrabold rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Start preview</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
