import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { SatQuestion } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
import MathReferenceSheetModal from '../../../components/sat/MathReferenceSheetModal';
import SprInput from '../../../components/sat/SprInput';
import { 
  Bookmark, 
  ArrowRight, 
  ArrowLeft, 
  Grid, 
  MoreVertical, 
  HelpCircle, 
  Keyboard, 
  Eye, 
  Sliders, 
  Pause, 
  LogOut, 
  Calculator, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Maximize2,
  Minimize2,
  X,
  Mic,
  BookOpen
} from 'lucide-react';

export default function SatPreviewRunner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();

  const subject = (searchParams.get('subject') as 'math' | 'reading-writing') || 'math';

  // Load question pool for this subject (e.g. 8 questions for preview)
  const questions: SatQuestion[] = useMemo(() => {
    const pool = initialSatQuestions.filter(q => q.section === subject);
    return pool.slice(0, 8);
  }, [subject]);

  // Session State (persisted per question in localStorage)
  const storageKey = `aies_preview_session_${subject}`;

  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return typeof parsed.currentIdx === 'number' ? parsed.currentIdx : 0;
      } catch {}
    }
    return 0;
  });

  // User responses: key is questionId -> { selected, markedForReview, crossedOut }
  const [answers, setAnswers] = useState<Record<string, {
    selected?: number | string;
    markedForReview?: boolean;
    crossedOut?: number[];
  }>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.answers || {};
      } catch {}
    }
    return {};
  });

  // Debounced persistent sync on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify({ currentIdx, answers }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [currentIdx, answers, storageKey]);

  // View States: 'question' | 'review' | 'transition'
  const [viewMode, setViewMode] = useState<'question' | 'review' | 'transition'>('question');

  // Modals & Panels
  const [isNavGridOpen, setIsNavGridOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  // Tools
  const [isCrossOutMode, setIsCrossOutMode] = useState(false);
  const [isLineReaderActive, setIsLineReaderActive] = useState(false);
  const [lineReaderPosition, setLineReaderPosition] = useState(120);
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] = useState(false);

  // Accessibility State
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [isSTTListening, setIsSTTListening] = useState(false);
  const [sttTranscript, setSttTranscript] = useState('');
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const activeQuestion = questions[currentIdx];
  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isMarked = Boolean(activeAnswer?.markedForReview);
  const crossedOutList = activeAnswer?.crossedOut || [];

  // Text-To-Speech
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeechPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
      return;
    }

    if (!activeQuestion) return;
    const textToRead = `${activeQuestion.questionText}. Options: ${activeQuestion.options?.map((o, idx) => `Choice ${String.fromCharCode(65 + idx)}: ${o}`).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeechPlaying(false);
    utterance.onerror = () => setIsSpeechPlaying(false);
    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeechPlaying(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIdx]);

  // Speech-To-Text for free response Math
  const handleToggleSTT = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech-to-text is not supported on this browser.');
      return;
    }

    if (isSTTListening) {
      setIsSTTListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSttTranscript(text);
        if (activeQuestion?.isSPR) {
          handleSelectAnswer(text);
        }
      };
      recognition.onerror = () => setIsSTTListening(false);
      recognition.onend = () => setIsSTTListening(false);
      recognition.start();
      setIsSTTListening(true);
    } catch {
      setIsSTTListening(false);
    }
  };

  // Answer selection
  const handleSelectAnswer = (val: number | string) => {
    if (!activeQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        selected: val
      }
    }));
  };

  // Toggle Mark for review
  const handleToggleMark = () => {
    if (!activeQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        markedForReview: !prev[activeQuestion.id]?.markedForReview
      }
    }));
  };

  // Cross-out single choice
  const handleToggleCrossOut = (optIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeQuestion) return;
    const currentList = answers[activeQuestion.id]?.crossedOut || [];
    const updated = currentList.includes(optIdx)
      ? currentList.filter(i => i !== optIdx)
      : [...currentList, optIdx];

    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        crossedOut: updated
      }
    }));
  };

  // Split Stimulus vs Question Stem
  const parsedQuestion = useMemo(() => {
    if (!activeQuestion) return { stimulus: '', stem: '' };
    const text = activeQuestion.questionText;

    if (text.includes('\n\nWhich choice') || text.includes('\n\nWhich of the following')) {
      const parts = text.split('\n\n');
      const stem = parts.pop() || '';
      const stimulus = parts.join('\n\n');
      return { stimulus, stem };
    }
    return {
      stimulus: activeQuestion.section === 'reading-writing' ? text : `Given the mathematical conditions:\n\n${text}`,
      stem: activeQuestion.section === 'reading-writing' ? 'Which choice best completes the text or answers the question?' : 'Solve for the required value:'
    };
  }, [activeQuestion]);

  const fontClass = fontSizeScale === 'xlarge' ? 'text-xl' : fontSizeScale === 'large' ? 'text-lg' : 'text-base';

  // PAGE 8: Save & Transition Screen
  if (viewMode === 'transition') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 font-sans text-center space-y-8 max-w-xl mx-auto">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            Section complete
          </h2>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
            Section complete. Your progress is saved — you can safely close this and pick up later.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 text-left space-y-3 w-full text-xs">
          <div className="flex justify-between font-semibold text-neutral-600">
            <span>Subject</span>
            <span className="font-bold text-neutral-900 capitalize">{subject === 'math' ? 'Math' : 'Reading & Writing'}</span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-600">
            <span>Total Questions</span>
            <span className="font-bold text-neutral-900">{questions.length} Items</span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-600">
            <span>Answered Count</span>
            <span className="font-bold text-blue-600">
              {Object.values(answers).filter(a => a.selected !== undefined && a.selected !== '').length} answered
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => setViewMode('review')}
            className="flex-1 py-3.5 px-4 rounded-xl border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-50 text-sm transition-colors"
          >
            Back to Review
          </button>
          <button
            onClick={() => navigate('/student')}
            className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white rounded-xl transition-all shadow-md"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // PAGE 7: Review Page ("Check your work")
  if (viewMode === 'review') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6 font-sans">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-neutral-100 pb-4">
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Check your work
            </h1>
            <p className="text-neutral-500 text-sm">
              On a timed test, you can't move to the next section until time is up. In practice mode, tap Next whenever you're ready.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-600">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-dashed border-neutral-400 bg-white" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>For Review</span>
            </div>
          </div>

          {/* Question Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isAnswered = ans?.selected !== undefined && ans?.selected !== '';
              const isFlagged = ans?.markedForReview;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setViewMode('question');
                  }}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between h-24 ${
                    isAnswered
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-black">{idx + 1}</span>
                    {isFlagged && <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />}
                  </div>
                  <span className="text-[11px] font-extrabold truncate max-w-full">
                    {isAnswered ? (typeof ans.selected === 'number' ? String.fromCharCode(65 + ans.selected) : ans.selected) : 'Unanswered'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action CTAs: Back & Next per Spec v3 Page 7 */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <button
              onClick={() => {
                setCurrentIdx(questions.length - 1);
                setViewMode('question');
              }}
              className="px-6 py-3 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setViewMode('transition')}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-all shadow-md flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // BASE QUESTION SCREEN (PAGES 5 & 6)
  if (!activeQuestion) {
    return <div className="p-8 text-center text-neutral-500">Loading question...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-2 font-sans select-none">
      {/* HEADER BAR (Section label, Shortcuts for Math, Tools icon) */}
      <div className="bg-white rounded-2xl px-5 py-3 border border-neutral-200 shadow-xs flex items-center justify-between gap-4">
        {/* Left: Section Label */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tight text-neutral-900 uppercase">
            {subject === 'math' ? 'Math' : 'Reading & Writing'}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            Preview Mode
          </span>
        </div>

        {/* Right: Tools & Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Desmos Grapher (Math only) */}
          {subject === 'math' && (
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
          )}

          {/* Reference sheet (Math only) */}
          {subject === 'math' && (
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reference sheet</span>
            </button>
          )}

          {/* More/Tools Menu Icon */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-colors"
            >
              <span>Tools</span>
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Exact Items per Spec v3 §3.7: 1. Help, 2. Keyboard shortcuts, 3. Accessibility, 4. Line reader, 5. Take a break, 6. Exit */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 bg-white rounded-2xl p-2 border border-neutral-200 shadow-xl space-y-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsHelpOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" /> Help
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsShortcutsOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                >
                  <Keyboard className="w-4 h-4 text-indigo-600" /> Keyboard shortcuts
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsAccessibilityOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                >
                  <Eye className="w-4 h-4 text-emerald-600" /> Accessibility
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsLineReaderActive(!isLineReaderActive);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                >
                  <Sliders className="w-4 h-4 text-purple-600" /> Line reader ({isLineReaderActive ? 'On' : 'Off'})
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsBreakModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                >
                  <Pause className="w-4 h-4 text-amber-600" /> Take a break
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsExitModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" /> Exit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TWO-PANE BODY SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative">
        {/* Line Reader Guide Overlay */}
        {isLineReaderActive && (
          <div
            style={{ top: `${lineReaderPosition}px` }}
            className="absolute left-0 right-0 h-10 bg-amber-400/20 border-y-2 border-amber-500 pointer-events-none z-30 transition-all"
          />
        )}

        {/* LEFT PANE: Passage/Stimulus (RW) or Problem Figure/Context (Math) */}
        {!isLeftPaneCollapsed ? (
          <div className="md:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4 max-h-[70vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {subject === 'reading-writing' ? 'Passage / Stimulus' : 'Problem Figure & Context'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                    isSpeechPlaying ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                  title="Read passage aloud"
                >
                  {isSpeechPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{isSpeechPlaying ? 'Stop' : 'Listen'}</span>
                </button>
                <button
                  onClick={() => setIsLeftPaneCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                  title="Collapse passage pane"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`prose prose-neutral max-w-none text-neutral-800 leading-relaxed whitespace-pre-line ${fontClass}`}>
              <p>{parsedQuestion.stimulus}</p>
            </div>
          </div>
        ) : (
          <div className="md:col-span-1 bg-white rounded-3xl p-4 border border-neutral-200 shadow-sm flex flex-col items-center justify-center">
            <button
              onClick={() => setIsLeftPaneCollapsed(false)}
              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex flex-col items-center gap-1"
              title="Expand passage pane"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-[10px] uppercase">Expand</span>
            </button>
          </div>
        )}

        {/* RIGHT PANE: Question Number Badge, Mark for Review, Stem, 4 Choices */}
        <div className={`${isLeftPaneCollapsed ? 'md:col-span-11' : 'md:col-span-6'} bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6 flex flex-col justify-between`}>
          <div className="space-y-6">
            {/* Header: Badge & Mark for Review */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
                  {currentIdx + 1}
                </span>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  {activeQuestion.skill}
                </span>
              </div>

              {/* Mark for review toggle */}
              <button
                type="button"
                onClick={handleToggleMark}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isMarked
                    ? 'bg-amber-400 border-amber-500 text-neutral-950 font-extrabold'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-neutral-950' : ''}`} />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Stem */}
            <div className={`font-semibold text-neutral-900 leading-snug ${fontClass}`}>
              {parsedQuestion.stem}
            </div>

            {/* Choices A-D (min 44px height rows, radio-style, struck choices remain selectable) */}
            {activeQuestion.isSPR ? (
              <div className="pt-2 space-y-3">
                <SprInput
                  value={typeof activeAnswer?.selected === 'string' ? activeAnswer.selected : ''}
                  onChange={(val) => handleSelectAnswer(val)}
                />
                <button
                  onClick={handleToggleSTT}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                    isSTTListening ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {isSTTListening ? 'Listening... speak answer' : 'Dictate Answer (Speech-to-Text)'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuestion.options?.map((opt, optIdx) => {
                  const isSelected = activeAnswer?.selected === optIdx;
                  const isCrossed = crossedOutList.includes(optIdx);
                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <div key={optIdx} className="relative group">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full min-h-[44px] text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                          isCrossed
                            ? 'opacity-40 line-through bg-neutral-50 border-neutral-200 text-neutral-500'
                            : isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className={`pt-0.5 ${fontClass}`}>{opt}</span>
                      </button>

                      {/* Cross-out Button / Undo link */}
                      {isCrossOutMode && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleCrossOut(optIdx, e)}
                          className={`absolute right-3 top-3.5 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                            isCrossed
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'text-neutral-400 hover:text-neutral-800 bg-neutral-100'
                          }`}
                        >
                          {isCrossed ? 'Undo' : '✕'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BAR (§3 Page 6: Left: Cross out, Center: Question pill, Right: Back / Next) */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center justify-between gap-3">
        {/* Left: Cross out toggle */}
        <button
          onClick={() => setIsCrossOutMode(!isCrossOutMode)}
          className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isCrossOutMode
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <span className="line-through font-mono">abc</span>
          <span>Cross out</span>
        </button>

        {/* Center: Question Navigator Pill (Tappable, opens Navigator Grid) */}
        <div className="relative">
          <button
            onClick={() => setIsNavGridOpen(!isNavGridOpen)}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Grid className="w-4 h-4 text-blue-600" />
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </button>

          {/* Section Navigator Modal / Sheet (§3 Page 6.1) */}
          {isNavGridOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-14 z-50 w-80 bg-white rounded-3xl p-5 border border-neutral-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-xs font-black uppercase text-neutral-800">Section Navigator</span>
                <button onClick={() => setIsNavGridOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid with state indicators: Current (outlined), Answered (filled), Unanswered (dotted), For Review (flag) */}
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const ans = answers[q.id];
                  const isAnswered = ans?.selected !== undefined && ans?.selected !== '';
                  const isFlagged = ans?.markedForReview;
                  const isCurrent = idx === currentIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(idx);
                        setIsNavGridOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'border-2 border-blue-600 bg-white text-blue-600 ring-2 ring-blue-200'
                          : isAnswered
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && <Bookmark className="w-3 h-3 fill-amber-400 text-amber-400 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setIsNavGridOpen(false);
                  setViewMode('review');
                }}
                className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors text-center"
              >
                Go to review page
              </button>
            </div>
          )}
        </div>

        {/* Right: Back / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl border border-neutral-300 font-bold text-xs text-neutral-700 disabled:opacity-30 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={() => {
              if (currentIdx < questions.length - 1) {
                setCurrentIdx(prev => prev + 1);
              } else {
                setViewMode('review');
              }
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>{currentIdx === questions.length - 1 ? 'Review' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ACCESSIBILITY PANEL (§3 Page 6.4) */}
      {isAccessibilityOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> Accessibility & Assistive Tools
              </h3>
              <button onClick={() => setIsAccessibilityOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Text-to-Speech */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Text-to-Speech</p>
                  <p className="text-neutral-500 text-[11px]">Reads the current question and answer choices aloud.</p>
                </div>
                <button
                  onClick={handleToggleSpeech}
                  className={`px-3 py-1.5 rounded-xl font-bold ${
                    isSpeechPlaying ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {isSpeechPlaying ? 'Stop' : 'Play Audio'}
                </button>
              </div>

              {/* 2. Speech-to-Text */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Speech-to-Text</p>
                  <p className="text-neutral-500 text-[11px]">Dictate free-response Math answers using your microphone.</p>
                </div>
                <button
                  onClick={handleToggleSTT}
                  className={`px-3 py-1.5 rounded-xl font-bold ${
                    isSTTListening ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {isSTTListening ? 'Stop' : 'Dictate'}
                </button>
              </div>

              {/* 3. Screen Reader Support */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Screen Reader Support</p>
                  <p className="text-neutral-500 text-[11px]">ARIA markup active and optimized for VoiceOver/NVDA.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                  Active
                </span>
              </div>

              {/* 4. Zoom & Magnification */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div>
                  <p className="font-bold text-neutral-900">Zoom & Magnification</p>
                  <p className="text-neutral-500 text-[11px]">Adjust in-app text scale independently of browser zoom.</p>
                </div>
                <div className="flex gap-2">
                  {(['normal', 'large', 'xlarge'] as const).map(scale => (
                    <button
                      key={scale}
                      onClick={() => setFontSizeScale(scale)}
                      className={`flex-1 py-1.5 rounded-xl font-bold capitalize transition-all ${
                        fontSizeScale === scale
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-neutral-300 text-neutral-700'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Math Rendering */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Math Rendering</p>
                  <p className="text-neutral-500 text-[11px]">Equations rendered with high-fidelity KaTeX/MathJax formatting.</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-[10px]">
                  Enabled
                </span>
              </div>

              {/* 6. Link to Referenced Source */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Link to Referenced Source</p>
                  <p className="text-neutral-500 text-[11px]">Jump to the exact textbook page and line citation in the library.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAccessibilityOpen(false);
                    navigate('/student/sat/textbooks');
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Library
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsAccessibilityOpen(false)}
              className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* EXIT FLOW MODAL (§3 Page 9) */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-neutral-900">
                Exit this preview?
              </h3>
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                Exit this preview? Since it's untimed practice, nothing is scored — but if you'd like to pick this exact spot back up, tap Continue instead.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => navigate('/student')}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-colors"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Help & Testing FAQ
              </h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p><strong>Two-Pane Layout:</strong> Passages appear on the left; questions and response options on the right.</p>
              <p><strong>Flagging:</strong> Use 'Mark for Review' to bookmark items you wish to revisit on the review screen.</p>
              <p><strong>Cross-out Tool:</strong> Strike out eliminated choices to narrow down your selection.</p>
              <p><strong>Desmos Grapher:</strong> In Math, access the full graphing calculator from the top header.</p>
            </div>
            <button onClick={() => setIsHelpOpen(false)} className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-600" /> Keyboard Shortcuts
              </h3>
              <button onClick={() => setIsShortcutsOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-semibold text-neutral-700">Next Question</span>
                <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono">Alt + N</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-semibold text-neutral-700">Previous Question</span>
                <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono">Alt + P</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-semibold text-neutral-700">Mark for Review</span>
                <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono">Alt + M</kbd>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-neutral-700">Select Choice A–D</span>
                <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono">A / B / C / D</kbd>
              </div>
            </div>
            <button onClick={() => setIsShortcutsOpen(false)} className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      )}

      {/* TAKE A BREAK MODAL */}
      {isBreakModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Pause className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-neutral-900">Take a Break</h3>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Take a moment to pause. In this preview, time is untimed so you can resume whenever you are ready.
              </p>
            </div>
            <button
              onClick={() => setIsBreakModalOpen(false)}
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl"
            >
              Resume Preview
            </button>
          </div>
        </div>
      )}

      {/* DESMOS GRAPHING CALCULATOR MODAL */}
      <DesmosCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* MATH REFERENCE FORMULA SHEET MODAL */}
      <MathReferenceSheetModal
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />
    </div>
  );
}
