import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle2, Unlock, ArrowRight } from 'lucide-react';

export default function SatPreviewIntro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-xl max-w-xl w-full space-y-8 text-center">
        {/* Header Icon */}
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Title & Framing */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            About the Test Preview
          </h1>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
            The Test Preview lets you get familiar with the test structure, navigation, and assistive tools before taking an authentic test.
          </p>
        </div>

        {/* Framing Points */}
        <div className="grid grid-cols-1 gap-3.5 text-left pt-2">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Untimed exploration</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Take all the time you need to examine question formats and interface controls.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Not scored or recorded</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Your answers won't impact your official scores or progress history.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <Unlock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Device isn't locked</h3>
              <p className="text-xs text-neutral-500 mt-0.5">You can switch applications or exit freely via the More menu at any time.</p>
            </div>
          </div>
        </div>

        {/* Single Primary "Next" Action */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/sat/preview-subject')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
