import React from 'react';
import { 
  Accessibility, 
  X, 
  Sun, 
  Moon, 
  Eye, 
  Volume2, 
  Sparkles, 
  Check, 
  Type, 
  SplitSquareVertical, 
  Sliders, 
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useAccessibility, TextSize, ColorFilter } from '../../context/AccessibilityContext';

export default function AccessibilityControlModal() {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    dyslexicFont,
    setDyslexicFont,
    colorFilter,
    setColorFilter,
    lineReader,
    setLineReader,
    reducedMotion,
    setReducedMotion,
    isModalOpen,
    setIsModalOpen,
    speakText
  } = useAccessibility();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Accessibility & Assistive Suite
              </h2>
              <p className="text-xs text-neutral-500 dark:text-slate-400">
                Personalize text, contrast, reading tools, and sensory filters
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow text-neutral-900 dark:text-slate-100">
          
          {/* Text Size Scaling */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-blue-600" /> Text Size Scaling
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['sm', 'md', 'lg', 'xl', '2xl'] as TextSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    textSize === size
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-neutral-50 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border-neutral-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Display Toggles */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" /> Visual & Contrast Profiles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  highContrast
                    ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-md'
                    : 'bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">High Contrast Mode</p>
                  <p className="text-[10px] opacity-80">Maximum visual distinction</p>
                </div>
                {highContrast && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  darkMode
                    ? 'bg-slate-800 text-white border-blue-500 shadow-md'
                    : 'bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Dark Night Mode</p>
                  <p className="text-[10px] opacity-80">Reduces screen glare</p>
                </div>
                {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </button>
            </div>
          </div>

          {/* Dyslexia & Reading Focus Tools */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 flex items-center gap-1.5">
              <SplitSquareVertical className="w-4 h-4 text-purple-600" /> Reading & Dyslexia Assist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  dyslexicFont
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md'
                    : 'bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Dyslexia-Friendly Spacing</p>
                  <p className="text-[10px] opacity-80">Enhanced character distinction</p>
                </div>
                {dyslexicFont && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setLineReader(!lineReader)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  lineReader
                    ? 'bg-yellow-500 text-slate-950 border-yellow-500 font-bold shadow-md'
                    : 'bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Line Focus Ruler</p>
                  <p className="text-[10px] opacity-80">Follows cursor for line tracking</p>
                </div>
                {lineReader && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Color Tint Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" /> Color Tint Filter
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Default' },
                { id: 'amber', label: 'Warm Amber' },
                { id: 'blue-reducer', label: 'Anti-Blue' },
                { id: 'invert', label: 'Invert' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setColorFilter(f.id as ColorFilter)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    colorFilter === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-neutral-50 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border-neutral-200 dark:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Reader Voice Test */}
          <div className="p-4 bg-neutral-50 dark:bg-slate-800/60 rounded-2xl border border-neutral-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Text-to-Speech Engine</p>
                <p className="text-[10px] text-neutral-500 dark:text-slate-400">Test assistive voice synthesis</p>
              </div>
            </div>
            <button
              onClick={() => speakText('Welcome to AIES Digital SAT. All assistive accessibility controls are active.')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Test Voice
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-slate-800/80 border-t border-neutral-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
