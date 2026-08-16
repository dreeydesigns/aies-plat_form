import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface AppLoadingScreenProps {
  message?: string;
}

export default function AppLoadingScreen({ message = 'Initializing AIES Adaptive Engine...' }: AppLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-blue-600">
      {/* Background Radial Glow */}
      <div className="absolute w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-2xl shadow-blue-500/30 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="w-full h-full bg-slate-950 rounded-[22px]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Digital SAT Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            AIES Platform
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {message}
          </p>
        </div>

        {/* Pulsing Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 rounded-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
