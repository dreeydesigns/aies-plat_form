import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { calculateScaledScore, calculateTotalScore, SAT_DISCLAIMER } from '../../../utils/concordance';
import { SatQuestion, SatDomain, SatPracticeTest } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
import EmpathyResetModal from '../../../components/sat/EmpathyResetModal';
import FiveFingerWidget, { FiveFingerReason } from '../../../components/sat/FiveFingerWidget';
import SprInput from '../../../components/sat/SprInput';
import { LessonContent } from '../../../components/shared/LessonContent';
import { 
  Calculator, 
  Clock, 
  Flag, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Grid,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

interface TestSectionConfig {
  section: 'reading-writing' | 'math';
  moduleNumber: 1 | 2;
  timeLimitSeconds: number;
  questions: SatQuestion[];
}

export default function SatTestRunner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile, saveSatPracticeTest, logEmotionalState } = useAppContext();

  const mode = (searchParams.get('mode') as 'math' | 'english' | 'full') || 'math';

  // Build section configs
  const sectionsConfig: TestSectionConfig[] = useMemo(() => {
    const mathPool = initialSatQuestions.filter(q => q.section === 'math');
    const rwPool = initialSatQuestions.filter(q => q.section === 'reading-writing');

    if (mode === 'math') {
      return [
        { section: 'math', moduleNumber: 1, timeLimitSeconds: 35 * 60, questions: mathPool.slice(0, 6) },
        { section: 'math', moduleNumber: 2, timeLimitSeconds: 35 * 60, questions: mathPool.slice(6, 12).length > 0 ? mathPool.slice(6, 12) : mathPool.slice(0, 6) }
      ];
    } else if (mode === 'english') {
      return [
        { section: 'reading-writing', moduleNumber: 1, timeLimitSeconds: 32 * 60, questions: rwPool.slice(0, 6) },
        { section: 'reading-writing', moduleNumber: 2, timeLimitSeconds: 32 * 60, questions: rwPool.slice(6, 12).length > 0 ? rwPool.slice(6, 12) : rwPool.slice(0, 6) }
      ];
    } else {
      // Full SAT (4 modules)
      return [
        { section: 'reading-writing', moduleNumber: 1, timeLimitSeconds: 32 * 60, questions: rwPool.slice(0, 6) },
        { section: 'reading-writing', moduleNumber: 2, timeLimitSeconds: 32 * 60, questions: rwPool.slice(6, 12).length > 0 ? rwPool.slice(6, 12) : rwPool.slice(0, 6) },
        { section: 'math', moduleNumber: 1, timeLimitSeconds: 35 * 60, questions: mathPool.slice(0, 6) },
        { section: 'math', moduleNumber: 2, timeLimitSeconds: 35 * 60, questions: mathPool.slice(6, 12).length > 0 ? mathPool.slice(6, 12) : mathPool.slice(0, 6) }
      ];
    }
  }, [mode]);

  // Current State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isReviewScreen, setIsReviewScreen] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);

  // User answers & flags: key is questionId
  const [answers, setAnswers] = useState<Record<string, {
    selected: number | string;
    flagged?: boolean;
    timeSeconds?: number;
    fiveFinger?: boolean;
    fiveFingerReason?: string;
  }>>({});
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(35 * 60);
  const [hideTimer, setHideTimer] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNavGridOpen, setIsNavGridOpen] = useState(false);

  const activeConfig = sectionsConfig[currentSectionIndex];
  const activeQuestion = activeConfig?.questions[currentQuestionIndex];

  // Set timer on section switch
  useEffect(() => {
    if (activeConfig) {
      setTimeRemaining(activeConfig.timeLimitSeconds);
      setIsReviewScreen(false);
      setCurrentQuestionIndex(0);
    }
  }, [currentSectionIndex]);

  // Countdown timer
  useEffect(() => {
    if (isTestFinished) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSectionIndex, isTestFinished]);

  const handleTimeExpired = () => {
    // Automatically submit active section
    handleNextSection();
  };

  const handleToggleFlag = () => {
    if (!activeQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: {
        selected: prev[activeQuestion.id]?.selected ?? -1,
        flagged: !prev[activeQuestion.id]?.flagged
      }
    }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < sectionsConfig.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      finishFullTest();
    }
  };

  const finishFullTest = async () => {
    setIsTestFinished(true);

    // Compute scores
    const sectionResults = sectionsConfig.map(sec => {
      let rawScore = 0;
      sec.questions.forEach(q => {
        if (answers[q.id]?.selected === q.correctAnswer) {
          rawScore++;
        }
      });
      const scaled = calculateScaledScore(sec.section, rawScore, sec.questions.length);
      return {
        section: sec.section,
        module: sec.moduleNumber,
        questions: sec.questions.map(q => q.id),
        timeLimitSeconds: sec.timeLimitSeconds,
        rawScore,
        estimatedScaledScore: scaled,
        answers: answers
      };
    });

    const mathSecs = sectionResults.filter(s => s.section === 'math');
    const rwSecs = sectionResults.filter(s => s.section === 'reading-writing');

    const mathScaled = mathSecs.length > 0
      ? Math.round(mathSecs.reduce((sum, s) => sum + (s.estimatedScaledScore || 200), 0) / mathSecs.length)
      : 0;

    const rwScaled = rwSecs.length > 0
      ? Math.round(rwSecs.reduce((sum, s) => sum + (s.estimatedScaledScore || 200), 0) / rwSecs.length)
      : 0;

    const totalScaled = mode === 'full' ? calculateTotalScore(mathScaled, rwScaled) : (mathScaled || rwScaled);

    if (userProfile?.id) {
      await saveSatPracticeTest({
        userId: userProfile.id,
        mode,
        sections: sectionResults,
        totalEstimatedScore: totalScaled,
        completedAt: new Date().toISOString()
      });
    }
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // SCORE SUMMARY VIEW (WHEN TEST COMPLETED)
  if (isTestFinished) {
    const allQuestions = sectionsConfig.flatMap(s => s.questions);
    const missedQuestions = allQuestions.filter(q => answers[q.id]?.selected !== q.correctAnswer);

    // Calculate score metrics
    const mathQuestions = allQuestions.filter(q => q.section === 'math');
    const rwQuestions = allQuestions.filter(q => q.section === 'reading-writing');

    const mathRaw = mathQuestions.filter(q => answers[q.id]?.selected === q.correctAnswer).length;
    const rwRaw = rwQuestions.filter(q => answers[q.id]?.selected === q.correctAnswer).length;

    const mathScaled = mathQuestions.length > 0 ? calculateScaledScore('math', mathRaw, mathQuestions.length) : 0;
    const rwScaled = rwQuestions.length > 0 ? calculateScaledScore('reading-writing', rwRaw, rwQuestions.length) : 0;
    const totalScore = mode === 'full' ? calculateTotalScore(mathScaled, rwScaled) : (mathScaled || rwScaled);

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Score Header */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-8 shadow-xl space-y-4 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Practice Exam Complete
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            {totalScore}
            <span className="text-lg font-bold text-neutral-400"> / {mode === 'full' ? '1600' : '800'}</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {SAT_DISCLAIMER}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 border-t border-neutral-700/60">
            {mathQuestions.length > 0 && (
              <div>
                <p className="text-xs uppercase font-bold text-neutral-400">Math Scaled</p>
                <p className="text-2xl font-extrabold text-blue-400">{mathScaled}</p>
              </div>
            )}
            {rwQuestions.length > 0 && (
              <div>
                <p className="text-xs uppercase font-bold text-neutral-400">Reading & Writing</p>
                <p className="text-2xl font-extrabold text-emerald-400">{rwScaled}</p>
              </div>
            )}
          </div>
        </div>

        {/* Post-Test Missed Questions & Skill Recommendations */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Targeted Remediation & Recommendations
            </h3>
            <span className="text-xs font-bold text-neutral-500">
              {missedQuestions.length} Missed Items
            </span>
          </div>

          {missedQuestions.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 text-emerald-900 rounded-2xl font-bold">
              Perfect score! You mastered every question in this exam run.
            </div>
          ) : (
            <div className="space-y-4">
              {missedQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 bg-neutral-900 text-white rounded uppercase">
                      {q.domain}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold">{q.skill}</span>
                  </div>

                  <p className="text-sm font-medium text-neutral-800 line-clamp-2">
                    {q.questionText}
                  </p>

                  <div className="text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200 leading-relaxed">
                    <span className="font-bold text-neutral-900">Key Takeaway: </span>
                    {q.explanation}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => navigate(`/student/sat/practice?domain=${q.domain}`)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      Practice Similar Questions
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/student/sat/tests')}
            className="flex-1 py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white text-center transition-all shadow-sm"
          >
            Back to Test Center
          </button>
        </div>
      </div>
    );
  }

  // REVIEW SCREEN BEFORE SUBMITTING MODULE
  if (isReviewScreen) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-4">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Review Section: {activeConfig.section === 'math' ? 'Math' : 'Reading & Writing'} Module {activeConfig.moduleNumber}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Verify your answers or revisit flagged questions before completing this section.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-neutral-400">Time Left</p>
              <p className="text-xl font-extrabold text-neutral-800">{formatTime(timeRemaining)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {activeConfig.questions.map((q, idx) => {
              const ans = answers[q.id];
              const isAnswered = ans && ans.selected !== -1 && ans.selected !== undefined;
              const isFlagged = ans?.flagged;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setIsReviewScreen(false);
                  }}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between h-24 ${
                    isAnswered
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold">Q{idx + 1}</span>
                    {isFlagged && <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                  <span className="text-xs font-extrabold truncate max-w-full">
                    {isAnswered ? (typeof ans.selected === 'number' ? `Option ${String.fromCharCode(65 + ans.selected)}` : `Ans: ${ans.selected}`) : 'Unanswered'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              onClick={() => setIsReviewScreen(false)}
              className="px-6 py-3 rounded-xl border border-neutral-300 font-bold text-sm hover:bg-neutral-50 transition-colors"
            >
              Return to Questions
            </button>
            <button
              onClick={handleNextSection}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-all shadow-md flex items-center gap-2"
            >
              Submit Section
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUESTION SCREEN
  if (!activeQuestion) {
    return <div className="p-8 text-center text-neutral-500">Loading test module...</div>;
  }

  const selectedAnswer = answers[activeQuestion.id]?.selected;
  const isFlagged = answers[activeQuestion.id]?.flagged;
  const isFiveFinger = answers[activeQuestion.id]?.fiveFinger;
  const fiveFingerReason = answers[activeQuestion.id]?.fiveFingerReason as FiveFingerReason | undefined;

  // Count 5-Fingers in current module
  const fiveFingersUsed = Object.values(answers).filter(a => a.fiveFinger).length;

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

  const handleToggleFiveFinger = (questionId: string, reason?: FiveFingerReason) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        fiveFinger: reason !== undefined,
        fiveFingerReason: reason
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Visible Section Progress Bar */}
      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentQuestionIndex + 1) / (activeConfig.questions.length || 1)) * 100}%` }}
        />
      </div>

      {/* Top Test Navigation Bar */}
      <div className="bg-neutral-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-neutral-800 rounded">
            {activeConfig.section === 'math' ? 'Math' : 'Reading & Writing'} · Mod {activeConfig.moduleNumber}
          </span>
          <span className="text-xs font-bold text-neutral-300">
            Question {currentQuestionIndex + 1} of {activeConfig.questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* 5-Finger Formula Widget (Module 1 Only) */}
          {activeConfig.moduleNumber === 1 && (
            <FiveFingerWidget
              currentQuestionId={activeQuestion.id}
              isFlagged={Boolean(isFiveFinger)}
              activeReason={fiveFingerReason}
              usedCount={fiveFingersUsed}
              maxFingers={5}
              onToggleFinger={handleToggleFiveFinger}
            />
          )}

          {/* Timer Display & Toggle */}
          <div className="flex items-center gap-2">
            {!hideTimer ? (
              <span className="font-mono font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </span>
            ) : (
              <span className="text-xs font-bold text-neutral-400">Timer Hidden</span>
            )}
            <button
              onClick={() => setHideTimer(!hideTimer)}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
              title={hideTimer ? 'Show Timer' : 'Hide Timer'}
            >
              {hideTimer ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Desmos Grapher (Math only) */}
          {activeConfig.section === 'math' && (
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desmos</span>
            </button>
          )}

          {/* Flag Question */}
          <button
            onClick={handleToggleFlag}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-bold ${
              isFlagged
                ? 'border-amber-400 bg-amber-400 text-neutral-900'
                : 'border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Flag for review"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-neutral-900' : ''}`} />
            <span className="hidden sm:inline">Flag</span>
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {activeQuestion.skill}
        </div>

        <div className="text-base md:text-lg font-medium text-neutral-900 leading-relaxed">
          <LessonContent content={activeQuestion.questionText} />
        </div>

        {/* Options or SPR Input */}
        {activeQuestion.isSPR ? (
          <div className="pt-2">
            <SprInput
              value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
              onChange={(val) => handleSelectAnswer(val)}
            />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    isSelected
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
                  <span className="text-sm md:text-base pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-5 py-2.5 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => {
            if (currentQuestionIndex < activeConfig.questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
            } else {
              setIsReviewScreen(true);
            }
          }}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-all shadow-sm flex items-center gap-2"
        >
          {currentQuestionIndex === activeConfig.questions.length - 1 ? 'Review Section' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desmos Graphing Calculator */}
      <DesmosCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
}
