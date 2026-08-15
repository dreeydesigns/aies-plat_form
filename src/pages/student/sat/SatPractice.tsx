import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { initialTextbooks } from '../../../data/textbooks';
import { SatDomain, SatQuestion, SatPracticeSession } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
import EmpathyResetModal from '../../../components/sat/EmpathyResetModal';
import LevelUpModal from '../../../components/sat/LevelUpModal';
import DataLightBanner from '../../../components/sat/DataLightBanner';
import SprInput from '../../../components/sat/SprInput';
import { LessonContent } from '../../../components/shared/LessonContent';
import { normalizeTextbookId } from './SatTextbooks';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Award, 
  Layers, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Bookmark,
  BookMarked,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

export type SatSubjectSection = 'math' | 'reading-writing';

export const SAT_SUBJECT_DOMAINS: Record<SatSubjectSection, SatDomain[]> = {
  'math': [
    'algebra',
    'advanced-math',
    'problem-solving-data-analysis',
    'geometry-trigonometry'
  ],
  'reading-writing': [
    'information-ideas',
    'craft-structure',
    'expression-of-ideas',
    'standard-english-conventions'
  ]
};

export const DOMAIN_METADATA: Record<SatDomain, { 
  name: string; 
  section: SatSubjectSection; 
  description: string;
  defaultTextbookId: string;
  defaultPage: number;
}> = {
  'algebra': { 
    name: 'Algebra', 
    section: 'math', 
    description: 'Linear equations, systems, functions & inequalities',
    defaultTextbookId: 'sat-foundations-math',
    defaultPage: 1
  },
  'advanced-math': { 
    name: 'Advanced Math', 
    section: 'math', 
    description: 'Nonlinear equations, quadratics, radicals & polynomials',
    defaultTextbookId: 'sat-advanced-math-mastery',
    defaultPage: 1
  },
  'problem-solving-data-analysis': { 
    name: 'Problem-Solving & Data Analysis', 
    section: 'math', 
    description: 'Ratios, rates, percentages, distributions & statistics',
    defaultTextbookId: 'sat-foundations-math',
    defaultPage: 1
  },
  'geometry-trigonometry': { 
    name: 'Geometry & Trigonometry', 
    section: 'math', 
    description: 'Area, volume, triangles, circles & radian ratios',
    defaultTextbookId: 'sat-foundations-math',
    defaultPage: 1
  },
  'information-ideas': { 
    name: 'Information & Ideas', 
    section: 'reading-writing', 
    description: 'Central ideas, command of evidence & inferences',
    defaultTextbookId: 'sat-reading-writing-mastery',
    defaultPage: 1
  },
  'craft-structure': { 
    name: 'Craft & Structure', 
    section: 'reading-writing', 
    description: 'Words in context, text structure, purpose & connections',
    defaultTextbookId: 'sat-reading-writing-mastery',
    defaultPage: 1
  },
  'expression-of-ideas': { 
    name: 'Expression of Ideas', 
    section: 'reading-writing', 
    description: 'Rhetorical synthesis & logical transitions',
    defaultTextbookId: 'sat-reading-writing-mastery',
    defaultPage: 1
  },
  'standard-english-conventions': { 
    name: 'Standard English Conventions', 
    section: 'reading-writing', 
    description: 'Sentence boundaries, agreement, verb tense & modifiers',
    defaultTextbookId: 'sat-grammar-conventions',
    defaultPage: 1
  }
};

/**
 * Strict filtering function for practice question pool.
 * Guarantees that in 'topic' mode, 100% of returned questions match the exact domain requested.
 * In 'mixed' mode, 100% of returned questions match the selected subject.
 */
export function buildPracticeQuestionPool(
  mode: 'mixed' | 'topic',
  subject: SatSubjectSection,
  domain: SatDomain,
  userPlacements?: Record<string, string>
): SatQuestion[] {
  if (mode === 'topic') {
    // Strict domain matching - NEVER fallback to another domain or subject
    const matching = initialSatQuestions.filter(q => q.domain === domain);
    if (matching.length === 0) {
      return [];
    }

    // Adaptive sorting: prioritize questions matching the student's current tier
    const targetTier = userPlacements?.[domain] || 'intermediate';
    const tierMatches = matching.filter(
      q => q.difficulty === targetTier || (targetTier === 'expert' && q.difficulty === 'hard')
    );

    // If we have tier-specific questions, use them; otherwise return all questions for this exact domain
    const pool = tierMatches.length > 0 ? tierMatches : matching;
    return [...pool].sort(() => Math.random() - 0.5);
  } else {
    // Mixed mode: strictly filtered by subject section
    const matching = initialSatQuestions.filter(q => q.section === subject);
    return [...matching].sort(() => Math.random() - 0.5);
  }
}

export default function SatPractice() {
  const { 
    userProfile, 
    updateSatPlacement, 
    saveSatPracticeSession, 
    logEmotionalState,
    recordSkillAttempt,
    recordTextbookFollowThrough 
  } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Step 1: Subject Selection (Math vs Reading & Writing)
  const [selectedSubject, setSelectedSubject] = useState<SatSubjectSection>(() => {
    const domainParam = searchParams.get('domain') as SatDomain | null;
    if (domainParam && DOMAIN_METADATA[domainParam]) {
      return DOMAIN_METADATA[domainParam].section;
    }
    const saved = localStorage.getItem('aies_practice_subject');
    return (saved === 'math' || saved === 'reading-writing') ? saved : 'reading-writing';
  });

  // Step 2: Topic Selection (Scoped to active subject)
  const [selectedDomain, setSelectedDomain] = useState<SatDomain>(() => {
    const domainParam = searchParams.get('domain') as SatDomain | null;
    if (domainParam && DOMAIN_METADATA[domainParam]) {
      return domainParam;
    }
    const savedDomain = localStorage.getItem('aies_practice_domain') as SatDomain | null;
    if (savedDomain && DOMAIN_METADATA[savedDomain]) {
      return savedDomain;
    }
    return 'information-ideas';
  });

  // Mode: 'topic' (Targeted Domain) vs 'mixed' (Subject-Wide Mix)
  const [practiceMode, setPracticeMode] = useState<'topic' | 'mixed'>(() => {
    const saved = localStorage.getItem('aies_practice_mode');
    return saved === 'mixed' ? 'mixed' : 'topic';
  });

  const [isDataLight, setIsDataLight] = useState(false);

  // Active question pool and interaction state
  const [questionPool, setQuestionPool] = useState<SatQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sprAnswer, setSprAnswer] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFiveFinger, setIsFiveFinger] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Session answer history
  const [sessionAnswers, setSessionAnswers] = useState<Array<{
    questionId: string;
    selected: number | string;
    correct: boolean;
    timeSeconds: number;
    revisited: boolean;
    domain: SatDomain;
    bookmarked: boolean;
    fiveFinger: boolean;
  }>>([]);

  // Telemetry & Latency
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showEmpathyModal, setShowEmpathyModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ domain: SatDomain; newLevel: 'beginner' | 'intermediate' | 'expert' } | null>(null);

  // Synchronize URL search params and initialize state
  useEffect(() => {
    const domainParam = searchParams.get('domain') as SatDomain | null;
    if (domainParam && DOMAIN_METADATA[domainParam]) {
      const parentSubject = DOMAIN_METADATA[domainParam].section;
      setSelectedSubject(parentSubject);
      setSelectedDomain(domainParam);
      setPracticeMode('topic');
      localStorage.setItem('aies_practice_subject', parentSubject);
      localStorage.setItem('aies_practice_domain', domainParam);
      localStorage.setItem('aies_practice_mode', 'topic');
    }
  }, [searchParams]);

  // Compute question pool whenever subject, domain, or mode changes
  useEffect(() => {
    const placements = userProfile?.satProfile?.placementByDomain || {};
    const pool = buildPracticeQuestionPool(practiceMode, selectedSubject, selectedDomain, placements);
    setQuestionPool(pool);
    setCurrentIdx(0);
    setSelectedOption(null);
    setSprAnswer('');
    setIsBookmarked(false);
    setIsFiveFinger(false);
    setIsSubmitted(false);
    setTimeSpent(0);
  }, [practiceMode, selectedSubject, selectedDomain, userProfile]);

  // Timer loop for active question
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, questionPool]);

  // Handle Step 1 (Subject) Change
  const handleSelectSubject = (newSubject: SatSubjectSection) => {
    if (newSubject === selectedSubject) return;
    setSelectedSubject(newSubject);
    localStorage.setItem('aies_practice_subject', newSubject);

    // Reset Step 2 topic to the primary domain of the newly selected subject
    const defaultDomain = SAT_SUBJECT_DOMAINS[newSubject][0];
    setSelectedDomain(defaultDomain);
    localStorage.setItem('aies_practice_domain', defaultDomain);

    // Update URL query param cleanly
    setSearchParams({ domain: defaultDomain });
  };

  // Handle Step 2 (Topic) Change
  const handleSelectDomain = (domain: SatDomain) => {
    setSelectedDomain(domain);
    setPracticeMode('topic');
    localStorage.setItem('aies_practice_domain', domain);
    localStorage.setItem('aies_practice_mode', 'topic');
    setSearchParams({ domain });
  };

  // Handle Mode Change (Topic vs Mixed)
  const handleTogglePracticeMode = (mode: 'topic' | 'mixed') => {
    setPracticeMode(mode);
    localStorage.setItem('aies_practice_mode', mode);
  };

  const currentQuestion = questionPool[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || isSubmitted) return;

    let isCorrect = false;
    let chosenVal: number | string = '';

    if (currentQuestion.isSPR) {
      if (!sprAnswer.trim()) return;
      chosenVal = sprAnswer.trim();
      isCorrect = String(currentQuestion.correctAnswer).trim() === sprAnswer.trim();
    } else {
      if (selectedOption === null) return;
      chosenVal = selectedOption;
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    }

    setIsSubmitted(true);

    const record = {
      questionId: currentQuestion.id,
      selected: chosenVal,
      correct: isCorrect,
      timeSeconds: timeSpent,
      revisited: false,
      domain: currentQuestion.domain,
      bookmarked: isBookmarked,
      fiveFinger: isFiveFinger
    };

    const updatedSession = [...sessionAnswers, record];
    setSessionAnswers(updatedSession);

    // Continuous Student Understanding Engine Telemetry
    await recordSkillAttempt(
      currentQuestion.skill,
      currentQuestion.domain,
      isCorrect,
      timeSpent,
      currentQuestion.difficulty
    );

    // Emotional telemetry logging
    if (userProfile?.id) {
      const cognitiveLoad = timeSpent > 45 ? 'high' : timeSpent < 15 ? 'low' : 'medium';
      const emotionalValence = isCorrect ? 'engaged' : timeSpent > 45 ? 'frustrated' : 'neutral';
      const flowState = isCorrect ? 'flow' : 'anxious';

      await logEmotionalState({
        userId: userProfile.id,
        sessionId: 'sat-practice',
        cognitiveLoad,
        emotionalValence,
        flowState,
        latencyMs: timeSpent * 1000,
        timestamp: new Date().toISOString()
      });
    }

    // Check consecutive errors for empathy reset
    const recentAnswers = updatedSession.slice(-3);
    if (recentAnswers.length === 3 && recentAnswers.every(a => !a.correct)) {
      setShowEmpathyModal(true);
    }

    // Continuous difficulty adaptation (Spec v3 Section 5)
    const domainRecent = updatedSession.filter(a => a.domain === currentQuestion.domain).slice(-8);
    if (domainRecent.length >= 8) {
      const correctCount = domainRecent.filter(a => a.correct).length;
      const acc = correctCount / domainRecent.length;
      const currentLevel = userProfile?.satProfile?.placementByDomain?.[currentQuestion.domain] || 'intermediate';

      if (acc > 0.85 && currentLevel !== 'expert') {
        const nextLevel = currentLevel === 'beginner' ? 'intermediate' : 'expert';
        console.log(`[Adaptive Engine] Tier escalated for ${currentQuestion.domain}: ${currentLevel} -> ${nextLevel} (Rolling Accuracy: ${Math.round(acc * 100)}%, window: 8)`);
        await updateSatPlacement(currentQuestion.domain, nextLevel);
        setLevelUpData({ domain: currentQuestion.domain, newLevel: nextLevel });
      } else if (acc < 0.50 && currentLevel !== 'beginner') {
        const lowerLevel = currentLevel === 'expert' ? 'intermediate' : 'beginner';
        console.log(`[Adaptive Engine] Tier de-escalated for ${currentQuestion.domain}: ${currentLevel} -> ${lowerLevel} (Rolling Accuracy: ${Math.round(acc * 100)}%, window: 8)`);
        await updateSatPlacement(currentQuestion.domain, lowerLevel);
      }
    }

    // Consecutive Hard-tier tracker
    if (isCorrect && (currentQuestion.difficulty === 'expert' || currentQuestion.difficulty === 'hard')) {
      const secKey = currentQuestion.section === 'math' ? 'math' : 'rw';
      const prevConsec = userProfile?.satProfile?.consecutiveHardCorrect?.[secKey] || 0;
      const newConsec = prevConsec + 1;
      console.log(`[Practice] Consecutive Hard-tier correct in ${secKey}: ${newConsec}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questionPool.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setSprAnswer('');
      setIsBookmarked(false);
      setIsFiveFinger(false);
      setIsSubmitted(false);
      setTimeSpent(0);
    } else {
      // Re-shuffle current pool
      const placements = userProfile?.satProfile?.placementByDomain || {};
      const newPool = buildPracticeQuestionPool(practiceMode, selectedSubject, selectedDomain, placements);
      setQuestionPool(newPool);
      setCurrentIdx(0);
      setSelectedOption(null);
      setSprAnswer('');
      setIsBookmarked(false);
      setIsFiveFinger(false);
      setIsSubmitted(false);
      setTimeSpent(0);
    }
  };

  // Find referenced textbook for wrong-answer remediation
  const textbookRef = currentQuestion?.textbookRef;
  const normBookId = normalizeTextbookId(textbookRef?.textbookId);
  const referencedBook = textbookRef 
    ? initialTextbooks.find(b => b.id === textbookRef.textbookId || b.id === normBookId) 
    : null;

  const isCurrentCorrect = currentQuestion?.isSPR
    ? String(currentQuestion.correctAnswer).trim() === sprAnswer.trim()
    : selectedOption === currentQuestion?.correctAnswer;

  // Compute question counts per domain for live badge counters
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(DOMAIN_METADATA).forEach(d => {
      counts[d] = initialSatQuestions.filter(q => q.domain === d).length;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <DataLightBanner isDataLight={isDataLight} onToggleDataLight={setIsDataLight} />

      {/* Top Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Practice & Prepare
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Targeted skill workouts · Continuous adaptive calibration
            </p>
          </div>
        </div>

        {/* Practice Mode Switcher (Targeted vs Mixed) */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 shadow-xs">
          <button
            onClick={() => handleTogglePracticeMode('topic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              practiceMode === 'topic'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Choose Topic
          </button>
          <button
            onClick={() => handleTogglePracticeMode('mixed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              practiceMode === 'mixed'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Topics ({selectedSubject === 'math' ? 'Math' : 'R&W'})
          </button>
        </div>
      </div>

      {/* Step 1 & Step 2: Grouped Subject-First Topic Selector */}
      <div className="bg-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 shadow-md space-y-5">
        {/* Step 1: Subject Selector */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-neutral-400">
            STEP 1 — SUBJECT
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSelectSubject('math')}
              className={`py-3.5 px-6 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2.5 ${
                selectedSubject === 'math'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
              }`}
            >
              <span>Math</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectSubject('reading-writing')}
              className={`py-3.5 px-6 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2.5 ${
                selectedSubject === 'reading-writing'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
              }`}
            >
              <span>Reading & Writing</span>
            </button>
          </div>
        </div>

        {/* Step 2: Topic Selector (Scoped Strictly to Active Subject) */}
        {practiceMode === 'topic' && (
          <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-neutral-400">
                STEP 2 — TOPIC IN {selectedSubject === 'math' ? 'MATH' : 'READING & WRITING'}
              </label>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {selectedSubject === 'math' ? '4 Math Topics' : '4 R&W Topics'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAT_SUBJECT_DOMAINS[selectedSubject].map(domainKey => {
                const info = DOMAIN_METADATA[domainKey];
                const isSelected = selectedDomain === domainKey;
                const count = domainCounts[domainKey] || 0;
                const currentTier = userProfile?.satProfile?.placementByDomain?.[domainKey] || 'intermediate';

                return (
                  <button
                    key={domainKey}
                    type="button"
                    onClick={() => handleSelectDomain(domainKey)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 text-white ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold tracking-tight truncate text-white">
                        {info.name}
                      </p>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 leading-snug line-clamp-1">
                      {info.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700/40 text-[11px]">
                      <span className={`font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                        currentTier === 'expert' 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : currentTier === 'intermediate'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}>
                        {currentTier}
                      </span>
                      <span className="font-mono text-neutral-400">
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Explainer Caption */}
        <p className="text-xs text-neutral-400 leading-relaxed pt-1">
          Switching to {selectedSubject === 'math' ? 'Reading & Writing' : 'Math'} in Step 1 swaps Step 2 to its four topics — Math and R&W topics are never shown in the same row.
        </p>
      </div>

      {/* Main Practice Question Area */}
      {currentQuestion ? (
        <div className="space-y-6">
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-neutral-900 text-white rounded-xl text-xs font-black">
                Question {currentIdx + 1} of {questionPool.length}
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg">
                {DOMAIN_METADATA[currentQuestion.domain]?.name || currentQuestion.domain}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  currentQuestion.difficulty === 'expert'
                    ? 'bg-red-100 text-red-800'
                    : currentQuestion.difficulty === 'intermediate'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500 border-amber-600 text-white'
                    : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                }`}
                title="Bookmark for review"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>

              {currentQuestion.section === 'math' && (
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Desmos
                </button>
              )}
            </div>
          </div>

          {/* Question Body */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {currentQuestion.skill}
            </div>

            <div className="text-base md:text-lg font-medium text-neutral-900 leading-relaxed">
              <LessonContent content={currentQuestion.questionText} />
            </div>

            {/* Options or SPR Input */}
            {currentQuestion.isSPR ? (
              <div className="pt-2">
                <SprInput
                  value={sprAnswer}
                  onChange={setSprAnswer}
                  disabled={isSubmitted}
                  onEnterSubmit={handleSubmitAnswer}
                />
                {isSubmitted && (
                  <div className="mt-3 p-3 rounded-xl bg-neutral-100 text-xs font-mono font-bold text-neutral-800">
                    Correct Answer: {String(currentQuestion.correctAnswer)}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctAnswer;
                  const letter = String.fromCharCode(65 + idx);

                  let cardStyle = 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800';
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      cardStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrectAnswer) {
                      cardStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                    } else {
                      cardStyle = 'border-neutral-200 opacity-60 bg-neutral-50';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${cardStyle}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSubmitted && isCorrectAnswer
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isSelected
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm md:text-base pt-0.5">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Wrong Answer / Correct Answer Remediation Panel */}
            {isSubmitted && (
              <div
                className={`p-6 rounded-2xl border ${
                  isCurrentCorrect
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                } space-y-4`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCurrentCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Correct! Excellent Application of Concept</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>Explanation & Misconception Breakdown</span>
                    </>
                  )}
                </div>

                <div className="text-sm leading-relaxed text-neutral-700">
                  <LessonContent content={currentQuestion.explanation} />
                </div>

                {/* Deep Textbook Remediation Link */}
                {textbookRef && (
                  <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-neutral-800">
                          Review in Textbook: {referencedBook?.title || 'SAT Guide'}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Page {textbookRef.page} · "{textbookRef.highlightedText.substring(0, 45)}..."
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        await recordTextbookFollowThrough(currentQuestion.skill, currentQuestion.domain);
                        navigate(
                          `/student/sat/textbooks?textbookId=${normBookId || textbookRef.textbookId}&page=${textbookRef.page}&highlight=${encodeURIComponent(
                            textbookRef.highlightedText
                          )}`
                        );
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Jump to Page {textbookRef.page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button Bar */}
          <div className="flex justify-end gap-3 pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={currentQuestion.isSPR ? !sprAnswer.trim() : selectedOption === null}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3.5 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white text-sm transition-all shadow-sm flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Honest, Clear Empty State for Unseeded/Empty Topics */
        <div className="bg-white p-10 md:p-14 text-center rounded-3xl border border-neutral-200 shadow-sm space-y-5 max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            <Compass className="w-7 h-7 text-amber-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">
              {DOMAIN_METADATA[selectedDomain]?.name || 'Domain'} Practice Questions Coming Soon
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Original, calibrated Digital SAT practice questions for <strong>{DOMAIN_METADATA[selectedDomain]?.name}</strong> are currently being authored and verified. In the meantime, you can explore the complete curriculum in the Textbook Library.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() =>
                navigate(
                  `/student/sat/textbooks?textbookId=${DOMAIN_METADATA[selectedDomain]?.defaultTextbookId}&page=${DOMAIN_METADATA[selectedDomain]?.defaultPage}`
                )
              }
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              Study in Textbook Library
            </button>
            <button
              onClick={() => handleSelectDomain(selectedSubject === 'math' ? 'algebra' : 'information-ideas')}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
            >
              Switch to Available Topic
            </button>
          </div>
        </div>
      )}

      {/* Desmos Calculator */}
      <DesmosCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />

      {/* Empathy Reset Modal */}
      <EmpathyResetModal
        isOpen={showEmpathyModal}
        onClose={() => setShowEmpathyModal(false)}
        onSwitchDomain={() => {
          setShowEmpathyModal(false);
          setPracticeMode('topic');
        }}
      />

      {/* Level-Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          domain={levelUpData.domain}
          newLevel={levelUpData.newLevel}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
}
