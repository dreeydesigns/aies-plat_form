import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RefreshCw, XCircle } from 'lucide-react';

interface EmpathyBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternativeAnalogy?: (analogyType: string) => void;
}

export default function EmpathyBreakModal({ isOpen, onClose, onSelectAlternativeAnalogy }: EmpathyBreakModalProps) {
  const [seconds, setSeconds] = useState(60);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    if (!isOpen) return;
    setSeconds(60);
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const breathTimer = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(breathTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-purple-100 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in duration-300">
        
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-8 h-8 animate-pulse text-purple-600" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-neutral-900">Take a 60-Second Breather</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Learning is a journey. When frustration builds up, taking a short pause unlocks your brain's problem-solving pathways.
          </p>
        </div>

        {/* Guided Breathing Circle */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-4 border-purple-400 transition-transform duration-1000 ${
            breathPhase === 'Inhale' ? 'scale-110 bg-purple-100/50' : breathPhase === 'Hold' ? 'scale-100 bg-purple-50' : 'scale-90 bg-white'
          }`} />
          <div className="relative z-10 font-bold text-purple-900">
            <p className="text-2xl font-extrabold">{seconds}s</p>
            <p className="text-xs uppercase tracking-wider text-purple-600 mt-0.5">{breathPhase}</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
          💡 <strong>Neuro-Tip:</strong> Your brain consolidates deep neural connections during micro-breaks. Deep breathing decreases cortisol and restores working memory!
        </div>

        {/* Alternative Analogy Selector */}
        {onSelectAlternativeAnalogy && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Switch Explanation Style:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSelectAlternativeAnalogy('food');
                  onClose();
                }}
                className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                🍕 Food / Pizza
              </button>
              <button
                onClick={() => {
                  onSelectAlternativeAnalogy('gaming');
                  onClose();
                }}
                className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                🎮 Gaming / Quest
              </button>
              <button
                onClick={() => {
                  onSelectAlternativeAnalogy('sports');
                  onClose();
                }}
                className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                ⚽ Sports / Team
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            I'm Ready to Resume
          </button>
        </div>
      </div>
    </div>
  );
}
