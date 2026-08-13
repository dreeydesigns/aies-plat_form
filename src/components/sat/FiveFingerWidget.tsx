import React, { useState } from 'react';
import { Hand, AlertTriangle, Check, X, HelpCircle } from 'lucide-react';

export type FiveFingerReason = 'too-slow' | 'between-two' | 'dont-know' | 'trap-answer' | 'other';

interface FiveFingerWidgetProps {
  currentQuestionId: string;
  isFlagged: boolean;
  activeReason?: FiveFingerReason;
  usedCount: number;
  maxFingers?: number;
  onToggleFinger: (questionId: string, reason?: FiveFingerReason) => void;
  disabled?: boolean;
}

const reasonLabels: Record<FiveFingerReason, { title: string; desc: string }> = {
  'too-slow': {
    title: 'Time Sink / Too Slow',
    desc: 'Taking too long to calculate or read the passage'
  },
  'between-two': {
    title: 'Between Two Choices',
    desc: 'Eliminated two options, uncertain between remaining two'
  },
  'dont-know': {
    title: 'Unknown Concept',
    desc: 'Unfamiliar formula, rule, or vocabulary term'
  },
  'trap-answer': {
    title: 'Suspected Trap Answer',
    desc: 'Feels like a classic College Board distractor'
  },
  'other': {
    title: 'General Hesitation',
    desc: 'Unsure or guessing'
  }
};

export default function FiveFingerWidget({
  currentQuestionId,
  isFlagged,
  activeReason,
  usedCount,
  maxFingers = 5,
  onToggleFinger,
  disabled = false
}: FiveFingerWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAtLimit = usedCount >= maxFingers && !isFlagged;

  const handleOpen = () => {
    if (disabled) return;
    if (isFlagged) {
      // Toggle off if already flagged
      onToggleFinger(currentQuestionId, undefined);
    } else if (isAtLimit) {
      // Show warning modal
      setIsModalOpen(true);
    } else {
      // Open selection modal
      setIsModalOpen(true);
    }
  };

  const handleSelectReason = (reason: FiveFingerReason) => {
    onToggleFinger(currentQuestionId, reason);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        title="5-Finger Metacognitive Strategy"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
          isFlagged
            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
            : isAtLimit
            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
            : 'bg-white text-neutral-700 border-neutral-300 hover:border-amber-400 hover:bg-amber-50/50'
        }`}
      >
        <span className="text-sm">✋</span>
        <span>
          {isFlagged ? '5-Finger Active' : '5-Finger?'}
        </span>
        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
          isFlagged ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
        }`}>
          {usedCount}/{maxFingers}
        </span>
      </button>

      {/* Rationale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-xs">
                  ✋
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 text-lg">5-Finger Strategy</h3>
                  <p className="text-xs text-neutral-500">
                    {usedCount} of {maxFingers} strategic struggle flags used in Module 1
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAtLimit ? (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2 text-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mx-auto" />
                <h4 className="font-bold text-red-900 text-sm">5-Finger Limit Reached</h4>
                <p className="text-xs text-red-700 leading-relaxed">
                  You’ve used all 5 struggle flags for Module 1. Be especially deliberate and careful with pacing on the remaining questions!
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-2 w-full py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
                >
                  Understood
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  Why are you struggling with this question? Recording your reasoning trains your metacognitive test reflexes and separates careless errors from genuine skill gaps.
                </p>

                <div className="space-y-2">
                  {(Object.keys(reasonLabels) as FiveFingerReason[]).map((key) => {
                    const option = reasonLabels[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectReason(key)}
                        className="w-full text-left p-3 rounded-2xl border border-neutral-200 hover:border-amber-400 hover:bg-amber-50/60 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-bold text-xs text-neutral-900 group-hover:text-amber-900">
                            {option.title}
                          </p>
                          <p className="text-[11px] text-neutral-500">{option.desc}</p>
                        </div>
                        <Check className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
