import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SatChooseSubject() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'reading-writing'>('math');

  const handleStart = () => {
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

        {/* One field selector: Math or Reading & Writing */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
            Subject
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => setSelectedSubject('math')}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                selectedSubject === 'math'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-xs'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  selectedSubject === 'math' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Math</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Algebra, Advanced Math, Problem-Solving, Geometry & Trig with Desmos</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedSubject === 'math' ? 'border-blue-600 bg-blue-600' : 'border-neutral-300'
              }`}>
                {selectedSubject === 'math' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSubject('reading-writing')}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                selectedSubject === 'reading-writing'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  selectedSubject === 'reading-writing' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Reading & Writing</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Information & Ideas, Craft & Structure, Expression of Ideas, Conventions</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedSubject === 'reading-writing' ? 'border-emerald-600 bg-emerald-600' : 'border-neutral-300'
              }`}>
                {selectedSubject === 'reading-writing' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/student/sat/preview-intro')}
            className="py-4 px-6 rounded-2xl border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-50 text-sm transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Start Preview</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
