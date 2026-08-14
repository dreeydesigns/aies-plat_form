import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { SatQuestion, SatDomain } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
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
  XCircle, 
  FileText, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  ShieldCheck, 
  X,
  RotateCcw,
  Check
} from 'lucide-react';

export default function SatPreviewRunner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();

  const subject = (searchParams.get('subject') as 'math' | 'reading-writing') || 'math';

  // Load question pool for this subject
  const questions: SatQuestion[] = useMemo(() => {
    const pool = initialSatQuestions.filter(q => q.section === subject);
    return pool.slice(0, 8); // 8 questions for comprehensive preview
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

  // User responses: key is questionId -> { selected: number | string, markedForReview: boolean, crossedOut: number[] }
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

  // Persistent sync on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ currentIdx, answers }));
  }, [currentIdx, answers, storageKey]);

  // View States: 'question' | 'review' | 'transition'
  const [viewMode, setViewMode] = useState<'question' | 'review' | 'transition'>('question');

  // Modals and Tool Panels
  const [isNavGridOpen, setIsNavGridOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Cross-out mode toggle
  const [isCrossOutMode, setIsCrossOutMode] = useState(false);

  // Line Reader tool
  const [isLineReaderActive, setIsLineReaderActive] = useState(false);
  const [lineReaderPosition, setLineReaderPosition] = useState(120);

  // Accessibility Scaling
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const activeQuestion = questions[currentIdx];
  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isMarked = Boolean(activeAnswer?.markedForReview);
  const crossedOutList = activeAnswer?.crossedOut || [];

  // Speech synthesis for accessibility
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeechPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
      return;
    }

    if (!activeQuestion) return;
    const textToRead = `${activeQuestion.questionText}. Answer choices: ${activeQuestion.options?.map((o, idx) => `Choice ${String.fromCharCode(65 + idx)}: ${o}`).join('. ')}`;
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

  // Toggle cross-out on single option
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

  // Parse Stimulus vs Question Stem for Two-Pane Split
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

  // Font scale class
  const fontClass = fontSizeScale === 'xlarge' ? 'text-xl' : fontSizeScale === 'large' ? 'text-lg' : 'text-base';

  // PAGE 8: Save & Transition Screen
  if (viewMode === 'transition') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 font-sans text-center space-y-8 max-w-xl mx-auto">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            Your progress is saved
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            All your responses and flagged items have been safely recorded. On official tests, this screen transitions between timed modules.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 text-left space-y-3 w-full text-xs">
          <div className="flex justify-between font-semibold text-neutral-600">
            <span>Section</span>
            <span className="font-bold text-neutral-900 capitalize">{subject === 'math' ? 'Math Preview' : 'Reading & Writing Preview'}</span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-600">
            <span>Total Questions Reviewed</span>
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
            className="flex-1 py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-md"
          >
            Complete & Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // PAGE 7: Review Page ("Check your work" style summary)
  if (viewMode === 'review') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 font-sans">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                Check Your Work
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                {subject === 'math' ? 'Math' : 'Reading & Writing'} Section · Test Preview
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-sm">
              <span className="font-bold">Note: </span>
              On an authentic SAT exam, forward progress is gated by the section timer. In preview and practice mode, you can move forward freely.
            </div>
          </div>

          {/* Grid of all questions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Question Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
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
          </div>

          {/* Review Page Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <button
              onClick={() => setViewMode('question')}
              className="px-6 py-3 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Return to Questions
            </button>
            <button
              onClick={() => setViewMode('transition')}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-all shadow-md flex items-center gap-2"
            >
              Continue to Save & Transition
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PAGE 5 & 6: Main Question Screen with Two-Pane Split & In-Question Tools
  if (!activeQuestion) {
    return <div className="p-8 text-center text-neutral-500">Loading question...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-2 font-sans select-none">
      {/* TOP IN-QUESTION TOOLBAR (Section Nav, Accessibility, Tools, More Menu) */}
      <div className="bg-white rounded-2xl px-5 py-3 border border-neutral-200 shadow-xs flex items-center justify-between gap-4">
        {/* Left: Section Navigator trigger */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsNavGridOpen(!isNavGridOpen)}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Grid className="w-4 h-4 text-blue-600" />
              <span>Section Navigator (Q{currentIdx + 1} of {questions.length})</span>
            </button>

            {/* Navigator Dropdown Grid */}
            {isNavGridOpen && (
              <div className="absolute left-0 top-12 z-50 w-72 bg-white rounded-2xl p-4 border border-neutral-200 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-bold text-neutral-700 uppercase">Jump to Question</span>
                  <button onClick={() => setIsNavGridOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
                        className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                            : isAnswered
                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setIsNavGridOpen(false);
                    setViewMode('review');
                  }}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors text-center block"
                >
                  Go to Review Page →
                </button>
              </div>
            )}
          </div>

          <span className="text-xs font-bold px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg uppercase">
            {subject === 'math' ? 'Math Preview' : 'Reading & Writing Preview'}
          </span>
        </div>

        {/* Right: Assistive Tools & More Menu */}
        <div className="flex items-center gap-2">
          {/* Desmos Grapher (Math only) */}
          {subject === 'math' && (
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Desmos Calculator</span>
            </button>
          )}

          {/* Reference / Formula sheet */}
          {subject === 'math' && (
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reference</span>
            </button>
          )}

          {/* Cross-out (Eliminator) Tool Toggle */}
          <button
            onClick={() => setIsCrossOutMode(!isCrossOutMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isCrossOutMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
            title="Cross-out ruled out answer choices"
          >
            <span className="line-through font-mono">abc</span>
            <span className="hidden sm:inline">Cross-out</span>
          </button>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-colors"
            >
              <span>More</span>
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-2xl p-2 border border-neutral-200 shadow-xl space-y-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsHelpOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" /> Help & Tips
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsShortcutsOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Keyboard className="w-4 h-4 text-indigo-600" /> Keyboard Shortcuts
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsAccessibilityOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Eye className="w-4 h-4 text-emerald-600" /> Accessibility & Audio
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsLineReaderActive(!isLineReaderActive);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Sliders className="w-4 h-4 text-purple-600" /> Line Reader ({isLineReaderActive ? 'On' : 'Off'})
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsBreakModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Pause className="w-4 h-4 text-amber-600" /> Unscheduled Break
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsExitModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Exit Preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TWO-PANE QUESTION SCREEN LAYOUT (PAGE 5) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative">
        {/* Line Reader Overlay if Active */}
        {isLineReaderActive && (
          <div
            style={{ top: `${lineReaderPosition}px` }}
            className="absolute left-0 right-0 h-10 bg-amber-400/20 border-y-2 border-amber-500 pointer-events-none z-30 transition-all"
          />
        )}

        {/* LEFT PANE: Passage / Stimulus / Math Context (6 Columns) */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4 max-h-[70vh] overflow-y-auto relative">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {subject === 'reading-writing' ? 'Stimulus / Passage' : 'Problem Context'}
            </span>
            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                isSpeechPlaying ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
              title="Read text aloud"
            >
              {isSpeechPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{isSpeechPlaying ? 'Stop' : 'Listen'}</span>
            </button>
          </div>

          <div className={`prose prose-neutral max-w-none text-neutral-800 leading-relaxed whitespace-pre-line ${fontClass}`}>
            <p>{parsedQuestion.stimulus}</p>
          </div>
        </div>

        {/* RIGHT PANE: Question Number, Mark For Review, Stem, Options (6 Columns) */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header: Question Number & Mark For Review Toggle */}
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

            {/* Answer Choices A-D or SPR Grid-in */}
            {activeQuestion.isSPR ? (
              <div className="pt-2">
                <SprInput
                  value={typeof activeAnswer?.selected === 'string' ? activeAnswer.selected : ''}
                  onChange={(val) => handleSelectAnswer(val)}
                />
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
                        disabled={isCrossed}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                          isCrossed
                            ? 'opacity-35 line-through bg-neutral-100 border-neutral-200'
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

                      {/* Option Cross-out Eliminator Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleCrossOut(optIdx, e)}
                        className={`absolute right-3 top-3.5 p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isCrossed
                            ? 'bg-amber-100 text-amber-800'
                            : 'opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 bg-neutral-100'
                        }`}
                        title={isCrossed ? 'Restore choice' : 'Cross out choice'}
                      >
                        {isCrossed ? 'Undo' : '✕'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM IN-QUESTION NAVIGATION (BACK / NEXT / REVIEW PAGE SHORTCUT) */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 disabled:opacity-30 hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={() => setViewMode('review')}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          Go to Review Page
        </button>

        <button
          onClick={() => {
            if (currentIdx < questions.length - 1) {
              setCurrentIdx(prev => prev + 1);
            } else {
              setViewMode('review');
            }
          }}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-all shadow-sm flex items-center gap-2"
        >
          {currentIdx === questions.length - 1 ? 'Go to Review Page' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ACCESSIBILITY MODAL PANEL */}
      {isAccessibilityOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> Accessibility & Assistive Tools
              </h3>
              <button onClick={() => setIsAccessibilityOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Font Size scaling */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-800">Text Scaling / Zoom</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Default (100%)' },
                    { id: 'large', label: 'Large (125%)' },
                    { id: 'xlarge', label: 'X-Large (150%)' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setFontSizeScale(s.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center ${
                        fontSizeScale === s.id ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text-to-Speech */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                <p className="font-bold text-neutral-800">Text-to-Speech Engine</p>
                <p className="text-neutral-500">Read current passage and question choices aloud.</p>
                <button
                  onClick={handleToggleSpeech}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  {isSpeechPlaying ? 'Stop Audio' : 'Start Reading Aloud'}
                </button>
              </div>

              {/* Math rendering */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <p className="font-bold text-neutral-800">KaTeX Mathematical Rendering</p>
                <p className="text-neutral-500">All formulas and radicals are rendered using high-contrast vector typography.</p>
              </div>
            </div>

            <button
              onClick={() => setIsAccessibilityOpen(false)}
              className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl font-semibold">
                <span>Select Choice A, B, C, D</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded">A / B / C / D</span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl font-semibold">
                <span>Next Question</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded">Right Arrow</span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl font-semibold">
                <span>Previous Question</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded">Left Arrow</span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl font-semibold">
                <span>Mark for Review</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded">M</span>
              </div>
            </div>

            <button
              onClick={() => setIsShortcutsOpen(false)}
              className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* UNSCHEDULED BREAK MODAL */}
      {isBreakModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
              <Pause className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-neutral-900">Unscheduled Break Active</h3>
              <p className="text-xs text-neutral-500">Your test screen is paused. Take a deep breath before resuming.</p>
            </div>
            <button
              onClick={() => setIsBreakModalOpen(false)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md"
            >
              Resume Preview
            </button>
          </div>
        </div>
      )}

      {/* PAGE 9: EXIT FLOW CONFIRMATION MODAL */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center font-bold">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-neutral-900">Exit Test Preview?</h3>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed space-y-2">
              <p className="font-bold text-neutral-900">What happens when you exit?</p>
              <p>
                Since this is an <strong>untimed Test Preview</strong>, session answers are not scored or saved to your official progress history.
              </p>
              <p className="text-neutral-500">
                (Note: On scored official sessions or practice tests, your progress is permanently preserved).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50"
              >
                Cancel & Return
              </button>
              <button
                onClick={() => navigate('/student')}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                Yes, Exit Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desmos Graphing Calculator */}
      <DesmosCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
}
