import React from 'react';
import { Award, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { SatDomain } from '../../types';

interface LevelUpModalProps {
  isOpen: boolean;
  domain: SatDomain;
  newLevel: 'beginner' | 'intermediate' | 'expert';
  onClose: () => void;
}

const domainLabels: Record<SatDomain, string> = {
  'algebra': 'Algebra',
  'advanced-math': 'Advanced Math',
  'problem-solving-data-analysis': 'Problem-Solving & Data Analysis',
  'geometry-trigonometry': 'Geometry & Trigonometry',
  'information-ideas': 'Information & Ideas',
  'craft-structure': 'Craft & Structure',
  'expression-of-ideas': 'Expression of Ideas',
  'standard-english-conventions': 'Standard English Conventions'
};

export default function LevelUpModal({ isOpen, domain, newLevel, onClose }: LevelUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-100 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Festive background sparks */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-70 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-18 h-18 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-amber-200">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Accuracy Breakthrough (&gt;80%)
          </div>

          <h3 className="text-2xl font-black text-neutral-900 tracking-tight mb-1">
            You Levelled Up!
          </h3>
          <p className="text-lg font-bold text-blue-600 mb-2">
            {domainLabels[domain] || domain}
          </p>
          <p className="text-neutral-600 text-sm mb-6">
            Your mastery has reached <span className="font-bold text-neutral-900 uppercase tracking-wide px-2 py-0.5 bg-neutral-100 rounded">{newLevel}</span> difficulty! Next questions will automatically adjust to challenge your growth.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            Keep Crushing It
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
