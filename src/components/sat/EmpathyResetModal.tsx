import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, RefreshCw, ArrowRight } from 'lucide-react';

interface EmpathyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchDomain?: () => void;
}

export default function EmpathyResetModal({ isOpen, onClose, onSwitchDomain }: EmpathyResetModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const breathCycle = setInterval(() => {
      setPhase((current) => {
        if (current === 'Inhale') return 'Hold';
        if (current === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(breathCycle);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-100 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Heart className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
            Take a 30-Second Breath Reset
          </h3>
          <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
            Your brain just tackled a heavy cognitive challenge. Let your nervous system recalibrate before continuing.
          </p>

          {/* Breathing Visualizer */}
          <div className="my-6 flex flex-col items-center">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 border-4 ${
                phase === 'Inhale'
                  ? 'bg-purple-100 border-purple-400 scale-110'
                  : phase === 'Hold'
                  ? 'bg-indigo-100 border-indigo-400 scale-105'
                  : 'bg-emerald-100 border-emerald-400 scale-95'
              }`}
            >
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{phase}</p>
                <p className="text-3xl font-extrabold text-neutral-900 mt-1">{secondsLeft}s</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-3 italic">
              Slow, steady breathing clears working memory latency.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {onSwitchDomain && (
              <button
                onClick={onSwitchDomain}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 font-bold text-neutral-700 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-neutral-500" />
                Switch Domain
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Ready to Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
