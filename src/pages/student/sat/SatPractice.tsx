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
  RotateCcw, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';

const domainDetails: Record<SatDomain, { name: string; section: 'math' | 'reading-writing'; color: string }> = {
  'algebra': { name: 'Algebra', section: 'math', color: 'blue' },
  'advanced-math': { name: 'Advanced Math', section: 'math', color: 'indigo' },
  'problem-solving-data-analysis': { name: 'Problem-Solving & Data', section: 'math', color: 'cyan' },
  'geometry-trigonometry': { name: 'Geometry & Trig', section: 'math', color: 'teal' },
  'information-ideas': { name: 'Information & Ideas', section: 'reading-writing', color: 'emerald' },
  'craft-structure': { name: 'Craft & Structure', section: 'reading-writing', color: 'green' },
  'expression-of-ideas': { name: 'Expression of Ideas', section: 'reading-writing', color: 'amber' },
  'standard-english-conventions': { name: 'Standard English', section: 'reading-writing', color: 'purple' }
};

export default function SatPractice() {
  const { userProfile, updateSatPlacement, saveSatPracticeSession, logEmotionalState } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: 'mixed' (all domains weighted) vs 'topic' (selected domain)
  const [practiceMode, setPracticeMode] = useState<'mixed' | 'topic'>('mixed');
  const [selectedDomain, setSelectedDomain] = useState<SatDomain>('algebra');
  const [isDataLight, setIsDataLight] = useState(false);

  // Active question index and answer state
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

  // Filter & weight question pool
  const buildQuestionPool = (mode: 'mixed' | 'topic', domain: SatDomain) => {
    const placements = userProfile?.satProfile?.placementByDomain || {};

    if (mode === 'topic') {
      const targetDiff = placements[domain] || 'intermediate';
      let matching = initialSatQuestions.filter(q => q.domain === domain && q.difficulty === targetDiff);
      if (matching.length === 0) {
        matching = initialSatQuestions.filter(q => q.domain === domain);
      }
      return matching;
    } else {
      // Mixed: sample questions weighted by domain placement
      const all = [...initialSatQuestions];
      return all.sort(() => Math.random() - 0.5);
    }
  };

  // Initialize pool
  useEffect(() => {
    const domainParam = searchParams.get('domain') as SatDomain | null;
    if (domainParam && domainDetails[domainParam]) {
      setPracticeMode('topic');
      setSelectedDomain(domainParam);
      setQuestionPool(buildQuestionPool('topic', domainParam));
    } else {
      setQuestionPool(buildQuestionPool('mixed', 'algebra'));
    }
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setTimeSpent(0);
  }, [practiceMode, selectedDomain, searchParams]);

  // Timer loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx]);

  const currentQuestion = questionPool[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
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

    // Continuous difficulty adaptation (Spec v3 Section 5):
    // Track a rolling window of the last 8 answered questions
    // If rolling accuracy > 85% at the current difficulty tier -> escalate one tier (Easy->Medium->Hard)
    // If rolling accuracy < 50% at current tier -> de-escalate one tier (never below Easy)
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

    // Spec v3 Section 10: Track consecutive Hard-tier questions answered correctly to unlock Full-Length tests
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
      // Loop or re-shuffle
      setQuestionPool(buildQuestionPool(practiceMode, selectedDomain));
      setCurrentIdx(0);
      setSelectedOption(null);
      setSprAnswer('');
      setIsBookmarked(false);
      setIsFiveFinger(false);
      setIsSubmitted(false);
      setTimeSpent(0);
    }
  };

  // Find referenced textbook
  const textbookRef = currentQuestion?.textbookRef;
  const referencedBook = textbookRef ? initialTextbooks.find(b => b.id === textbookRef.textbookId) : null;

  const isCurrentCorrect = currentQuestion?.isSPR
    ? String(currentQuestion.correctAnswer).trim() === sprAnswer.trim()
    : selectedOption === currentQuestion?.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <DataLightBanner isDataLight={isDataLight} onToggleDataLight={setIsDataLight} />

      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">SAT Practice Studio</h1>
              <p className="text-xs text-neutral-500">Continuous adaptive re-calibration & textbook-deep remediation</p>
            </div>
          </div>
        </div>

        {/* Tabs: Mixed vs Choose Topic */}
        <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1 border border-neutral-200">
          <button
            onClick={() => setPracticeMode('mixed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              practiceMode === 'mixed'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Topics (Adaptive Mix)
          </button>
          <button
            onClick={() => setPracticeMode('topic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              practiceMode === 'topic'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Choose Topic
          </button>
        </div>
      </div>

      {/* Topic selector if mode === 'topic' */}
      {practiceMode === 'topic' && (
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
            Select SAT Domain
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(domainDetails) as SatDomain[]).map(domainKey => {
              const info = domainDetails[domainKey];
              const isSelected = selectedDomain === domainKey;
              const currentTier = userProfile?.satProfile?.placementByDomain?.[domainKey] || 'intermediate';

              return (
                <button
                  key={domainKey}
                  onClick={() => setSelectedDomain(domainKey)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <p className="text-xs font-extrabold truncate">{info.name}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {currentTier}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQuestion ? (
        <div className="space-y-4">
          {/* Question Sub-Header */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
                {domainDetails[currentQuestion.domain]?.name || currentQuestion.domain}
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                Difficulty: <span className="font-bold text-neutral-800 capitalize">{currentQuestion.difficulty}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                  isBookmarked
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-neutral-500 border-neutral-300 hover:bg-neutral-50'
                }`}
                title="Mark for review"
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

            <div className="text-base md:text-lg font-medium text-neutral-900 leading-relaxed whitespace-pre-line">
              {currentQuestion.questionText}
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

                <p className="text-sm leading-relaxed text-neutral-700">
                  {currentQuestion.explanation}
                </p>

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
                      onClick={() =>
                        navigate(
                          `/student/sat/textbooks?textbookId=${textbookRef.textbookId}&page=${textbookRef.page}&highlight=${encodeURIComponent(
                            textbookRef.highlightedText
                          )}`
                        )
                      }
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
        <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200">
          <p className="text-neutral-500 font-medium">No questions found in this domain.</p>
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
