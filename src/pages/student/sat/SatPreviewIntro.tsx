import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Layers, Accessibility, ArrowRight } from 'lucide-react';

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
            Test Preview
          </h1>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
            Get familiar with the test structure, navigation, and assistive tools before test day.
          </p>
        </div>

        {/* Exactly Three Info Blocks per Spec v3 Page 4 */}
        <div className="grid grid-cols-1 gap-3.5 text-left pt-2">
          {/* 1. What this is */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">What this is</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Sample questions and testing tools with no score or feedback.</p>
            </div>
          </div>

          {/* 2. Untimed */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Untimed</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Real sessions are timed; this preview isn't, so you can explore at your own pace.</p>
            </div>
          </div>

          {/* 3. Accessibility */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3.5">
            <Accessibility className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Accessibility</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Practice with any assistive tools (TTS, line reader, font zoom) you use before test day.</p>
            </div>
          </div>
        </div>

        {/* Single Primary CTA: Start preview */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/sat/preview-subject')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Start preview</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
