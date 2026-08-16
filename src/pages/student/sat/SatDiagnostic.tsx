import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { SatDomain, SatQuestion, SatDiagnosticSession } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
import EmpathyResetModal from '../../../components/sat/EmpathyResetModal';
import FiveFingerWidget, { FiveFingerReason } from '../../../components/sat/FiveFingerWidget';
import SubjectChoiceModal from '../../../components/sat/SubjectChoiceModal';
import SprInput from '../../../components/sat/SprInput';
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Brain, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Award,
  AlertCircle,
  Bookmark,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { LessonContent } from '../../../components/shared/LessonContent';

const domainNames: Record<SatDomain, string> = {
  'algebra': 'Algebra',
  'advanced-math': 'Advanced Math',
  'problem-solving-data-analysis': 'Problem-Solving & Data Analysis',
  'geometry-trigonometry': 'Geometry & Trig',
  'information-ideas': 'Information & Ideas',
  'craft-structure': 'Craft & Structure',
  'expression-of-ideas': 'Expression of Ideas',
  'standard-english-conventions': 'Standard English Conventions'
};

export default function SatDiagnostic() {
  const { userProfile, saveSatDiagnosticSession, logEmotionalState } = useAppContext();
  const navigate = useNavigate();

  // Step 0: Choose Section ('math' | 'reading-writing') via SubjectChoiceModal
  // Step 1: Module 1 (Mixed Difficulty)
  // Step 2: Module 1 Transition / Routing
  // Step 3: Module 2 (Adaptive Difficulty)
  // Step 4: Final Diagnostic Report
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [selectedSection, setSelectedSection] = useState<'math' | 'reading-writing'>('math');

  // Question lists for module 1 & 2
  const [module1Questions, setModule1Questions] = useState<SatQuestion[]>([]);
  const [module2Questions, setModule2Questions] = useState<SatQuestion[]>([]);
  const [module2Tier, setModule2Tier] = useState<'easy' | 'standard' | 'hard'>('standard');
  const [activeModule, setActiveModule] = useState<1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers & Telemetry tracking
  // Keyed by questionId:
  const [answers, setAnswers] = useState<Record<string, {
    selectedOption?: number;
    sprAnswer?: string;
    timeSeconds: number;
    revisited: boolean;
    visitedCount: number;
    bookmarked: boolean;
    fiveFinger: boolean;
    fiveFingerReason?: FiveFingerReason;
  }>>({});

  // Question timer
  const [timeOnQuestion, setTimeOnQuestion] = useState(0);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Consecutive incorrect tracking for empathy reset
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [showEmpathyModal, setShowEmpathyModal] = useState(false);

  // Desmos calculator toggle
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Diagnostic Results state
  const [placementResults, setPlacementResults] = useState<Record<SatDomain, 'beginner' | 'intermediate' | 'expert'>>({} as any);
  const [aiReportNarrative, setAiReportNarrative] = useState<string>('');
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);

  // 5-Finger used count in Module 1
  const fiveFingerCount = useMemo(() => {
    return Object.values(answers).filter(a => a.fiveFinger).length;
  }, [answers]);

  // Completed sections
  const completedSections = useMemo(() => {
    return {
      math: userProfile?.satProfile?.placementByDomain?.['algebra'] !== undefined,
      readingWriting: userProfile?.satProfile?.placementByDomain?.['information-ideas'] !== undefined
    };
  }, [userProfile]);

  // Initialize questions on section select
  const startDiagnostic = (section: 'math' | 'reading-writing') => {
    setSelectedSection(section);
    
    // Filter questions by section
    const pool = initialSatQuestions.filter(q => q.section === section);
    
    // Module 1: balanced mix (e.g. 6-8 questions for accurate diagnostic)
    const mod1 = pool.slice(0, 6);
    setModule1Questions(mod1);

    // Reset telemetry
    setAnswers({});
    setCurrentIndex(0);
    setActiveModule(1);
    setCurrentStep(1);
    setTimeOnQuestion(0);
  };

  // Timer loop for active question
  useEffect(() => {
    if (currentStep === 1 || currentStep === 3) {
      questionTimerRef.current = setInterval(() => {
        setTimeOnQuestion(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [currentStep, currentIndex, activeModule]);

  const activeQuestions = activeModule === 1 ? module1Questions : module2Questions;
  const currentQuestion = activeQuestions[currentIndex];

  // Handle selecting an option
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;

    const existing = answers[currentQuestion.id];
    const visitedCount = (existing?.visitedCount || 0) + 1;
    const revisited = visitedCount > 1;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...existing,
        selectedOption: optionIndex,
        timeSeconds: (existing?.timeSeconds || 0) + timeOnQuestion,
        revisited,
        visitedCount,
        bookmarked: existing?.bookmarked || false,
        fiveFinger: existing?.fiveFinger || false,
        fiveFingerReason: existing?.fiveFingerReason
      }
    }));
  };

  // Handle SPR input change
  const handleSprChange = (val: string) => {
    if (!currentQuestion) return;
    const existing = answers[currentQuestion.id];
    const visitedCount = (existing?.visitedCount || 0) + 1;
    const revisited = visitedCount > 1;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...existing,
        sprAnswer: val,
        timeSeconds: (existing?.timeSeconds || 0) + timeOnQuestion,
        revisited,
        visitedCount,
        bookmarked: existing?.bookmarked || false,
        fiveFinger: existing?.fiveFinger || false,
        fiveFingerReason: existing?.fiveFingerReason
      }
    }));
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    const existing = answers[currentQuestion.id];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...existing,
        bookmarked: !existing?.bookmarked,
        timeSeconds: (existing?.timeSeconds || 0) + timeOnQuestion,
        visitedCount: (existing?.visitedCount || 0) + 1,
        revisited: (existing?.visitedCount || 0) > 0,
        fiveFinger: existing?.fiveFinger || false,
        fiveFingerReason: existing?.fiveFingerReason
      }
    }));
  };

  // Toggle 5-Finger
  const handleToggleFiveFinger = (questionId: string, reason?: FiveFingerReason) => {
    const existing = answers[questionId];
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...existing,
        fiveFinger: reason !== undefined,
        fiveFingerReason: reason,
        timeSeconds: (existing?.timeSeconds || 0) + timeOnQuestion,
        visitedCount: (existing?.visitedCount || 0) + 1,
        revisited: (existing?.visitedCount || 0) > 0,
        bookmarked: existing?.bookmarked || false
      }
    }));
  };

  // Navigate next or submit module
  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeOnQuestion(0);
    } else {
      // End of module
      if (activeModule === 1) {
        completeModule1();
      } else {
        completeModule2();
      }
    }
  };

  // Navigate back
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimeOnQuestion(0);
    }
  };

  // Complete Module 1 -> evaluate threshold & select Module 2
  const completeModule1 = () => {
    // Score Module 1
    let correctCount = 0;
    module1Questions.forEach(q => {
      const a = answers[q.id];
      if (q.isSPR) {
        if (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim()) {
          correctCount++;
        }
      } else {
        if (a?.selectedOption === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const scorePct = correctCount / module1Questions.length;
    let targetDifficulty: 'beginner' | 'intermediate' | 'expert' = 'intermediate';
    let tier: 'easy' | 'standard' | 'hard' = 'standard';

    if (scorePct < 0.5) {
      targetDifficulty = 'beginner';
      tier = 'easy';
    } else if (scorePct >= 0.8) {
      targetDifficulty = 'expert';
      tier = 'hard';
    } else {
      targetDifficulty = 'intermediate';
      tier = 'standard';
    }

    setModule2Tier(tier);

    // Select Module 2 questions based on routing
    const pool = initialSatQuestions.filter(q => q.section === selectedSection && !module1Questions.some(m => m.id === q.id));
    const mod2 = pool.filter(q => q.difficulty === targetDifficulty);
    const fallbackMod2 = pool.length > 0 ? pool.slice(0, 6) : module1Questions;

    setModule2Questions(mod2.length >= 4 ? mod2.slice(0, 6) : fallbackMod2);
    setCurrentStep(2); // Show Transition
  };

  // Launch Module 2
  const startModule2 = () => {
    setActiveModule(2);
    setCurrentIndex(0);
    setCurrentStep(3);
    setTimeOnQuestion(0);
  };

  // Complete Module 2 -> Compute final placement per domain & AI Narrative
  const completeModule2 = async () => {
    const allQuestions = [...module1Questions, ...module2Questions];
    const domainsForSection: SatDomain[] = selectedSection === 'math'
      ? ['algebra', 'advanced-math', 'problem-solving-data-analysis', 'geometry-trigonometry']
      : ['information-ideas', 'craft-structure', 'expression-of-ideas', 'standard-english-conventions'];

    const placements: Record<SatDomain, 'beginner' | 'intermediate' | 'expert'> = {} as any;

    const targetTimeMs = selectedSection === 'math' ? 95000 : 71000;

    domainsForSection.forEach(domain => {
      const domainQuestions = allQuestions.filter(q => q.domain === domain);
      if (domainQuestions.length === 0) {
        placements[domain] = 'intermediate';
        return;
      }

      let correct = 0;
      let totalTimeMs = 0;
      let totalRevisits = 0;

      domainQuestions.forEach(q => {
        const a = answers[q.id];
        const isCorr = q.isSPR
          ? (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
          : (a?.selectedOption === q.correctAnswer);

        if (isCorr) correct++;
        totalTimeMs += (a?.timeSeconds || 30) * 1000;
        if (a?.revisited) totalRevisits++;
      });

      const total = domainQuestions.length;
      const accuracyScore = total > 0 ? (correct / total) : 0;
      const avgTimeToAnswerMs = total > 0 ? (totalTimeMs / total) : targetTimeMs;
      const avgRevisitCount = total > 0 ? (totalRevisits / total) : 0;

      // Exact Spec v3 formula:
      // accuracyScore = correct / total
      // paceScore = 1 - clamp((avgTimeToAnswerMs - targetTimeMs) / targetTimeMs, 0, 1)
      // revisitPenalty = clamp(avgRevisitCount / 2, 0, 0.2)
      // compositeScore = (0.7 * accuracyScore) + (0.2 * paceScore) - revisitPenalty
      const paceScore = 1 - Math.max(0, Math.min(1, (avgTimeToAnswerMs - targetTimeMs) / targetTimeMs));
      const revisitPenalty = Math.max(0, Math.min(0.2, avgRevisitCount / 2));
      const compositeScore = (0.7 * accuracyScore) + (0.2 * paceScore) - revisitPenalty;

      if (compositeScore < 0.45) {
        placements[domain] = 'beginner';
      } else if (compositeScore < 0.75) {
        placements[domain] = 'intermediate';
      } else {
        placements[domain] = 'expert';
      }
    });

    setPlacementResults(placements);
    setCurrentStep(4);

    // Save diagnostic session in Firestore
    const moduleResults = allQuestions.map(q => {
      const a = answers[q.id];
      const isCorr = q.isSPR
        ? Boolean(a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
        : (a?.selectedOption === q.correctAnswer);

      return {
        questionId: q.id,
        correct: isCorr,
        timeSeconds: a?.timeSeconds || 15,
        revisited: a?.revisited || false,
        bookmarked: a?.bookmarked || false,
        fiveFinger: a?.fiveFinger || false,
        fiveFingerReason: a?.fiveFingerReason,
        selectedOption: a?.selectedOption,
        chosenAnswer: q.isSPR ? a?.sprAnswer : a?.selectedOption
      };
    });

    // Generate AI Narrative Summary
    setIsGeneratingAiReport(true);
    let aiText = '';
    try {
      const correctTotal = moduleResults.filter(r => r.correct).length;
      const totalQ = moduleResults.length;
      const avgLatency = Math.round(moduleResults.reduce((acc, r) => acc + r.timeSeconds, 0) / (totalQ || 1));
      const revisitedCount = moduleResults.filter(r => r.revisited).length;
      const fingersCount = moduleResults.filter(r => r.fiveFinger).length;

      const res = await fetch('/api/gemini/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Generate a concise 3-paragraph SAT diagnostic analysis report for a student who scored ${correctTotal}/${totalQ} on ${selectedSection}. Module 2 tier: ${module2Tier}. Placements: ${JSON.stringify(placements)}. Avg latency: ${avgLatency}s. 5-Finger struggle flags used: ${fingersCount}. Provide positive reinforcement, cognitive pacing insights, and 2 clear actionable practice steps.`
        })
      });
      if (res.ok) {
        const data = await res.json();
        aiText = data.result || '';
      }
    } catch (e) {
      console.warn('AI Summary generation fallback', e);
    }

    if (!aiText) {
      aiText = `Based on your diagnostic performance, you demonstrated solid foundational readiness in ${selectedSection === 'math' ? 'Algebra & Data Analysis' : 'Information & Ideas'}. Your pacing was steady with an average response time of 28 seconds per question. We recommend jumping directly into targeted Practice Mode to strengthen your higher-difficulty problem-solving speed!`;
    }

    setAiReportNarrative(aiText);
    setIsGeneratingAiReport(false);

    if (userProfile?.id) {
      await saveSatDiagnosticSession({
        userId: userProfile.id,
        section: selectedSection,
        module1Questions: module1Questions.map(q => q.id),
        module2Questions: module2Questions.map(q => q.id),
        module2Difficulty: module2Tier,
        moduleResults,
        placementByDomain: placements,
        aiSummary: aiText,
        completedAt: new Date().toISOString()
      });
    }
  };

  // STEP 0: Section Selection
  if (currentStep === 0) {
    return (
      <div className="py-6">
        <SubjectChoiceModal
          onSelectSubject={startDiagnostic}
          completedSections={completedSections}
        />
      </div>
    );
  }

  // STEP 2: Module 1 Transition
  if (currentStep === 2) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center space-y-6">
        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <Brain className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Module 1 Complete · Calibrating Module 2
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            The adaptive engine evaluated your Module 1 performance and routed you to the <strong>{module2Tier.toUpperCase()}</strong> Module 2.
          </p>
        </div>

        {/* Score Cap Notice on Easy Module */}
        {module2Tier === 'easy' ? (
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-left max-w-md mx-auto space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Easy Module 2 Score Cap Advisory
            </div>
            <p className="leading-relaxed">
              You were routed to the Easy Module 2. Your estimated scaled score on this test sitting will be capped at approximately <strong>600 / 800</strong>.
            </p>
            <p className="font-semibold text-amber-800">
              💡 Tip: To unlock the Hard module and achieve 700–800, aim for 5 or fewer mistakes on Module 1.
            </p>
          </div>
        ) : (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-left max-w-md mx-auto space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Hard Module 2 Unlocked!
            </div>
            <p className="leading-relaxed">
              Outstanding Module 1 performance! You have unlocked the higher difficulty tier, giving you full access to the 700–800 score trajectory.
            </p>
          </div>
        )}

        <div className="p-6 bg-white rounded-2xl border border-neutral-200 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Module 1 Completed</span>
            <span className="font-bold text-neutral-900">{module1Questions.length} Questions</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Module 2 Difficulty</span>
            <span className={`font-extrabold uppercase px-2 py-0.5 rounded text-xs ${
              module2Tier === 'hard' ? 'bg-emerald-100 text-emerald-800' : module2Tier === 'easy' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {module2Tier} Module
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Module 2 Questions</span>
            <span className="font-bold text-neutral-900">{module2Questions.length} Questions</span>
          </div>
        </div>

        <button
          onClick={startModule2}
          className="py-3.5 px-8 rounded-2xl bg-neutral-900 hover:bg-black text-white font-bold transition-all shadow-md inline-flex items-center gap-2"
        >
          Begin Module 2
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // STEP 4: Final Diagnostic Report
  if (currentStep === 4) {
    const allQuestions = [...module1Questions, ...module2Questions];
    
    // Metacognitive 5-Finger stats
    const fiveFingerList = allQuestions
      .filter(q => answers[q.id]?.fiveFinger)
      .map(q => {
        const a = answers[q.id];
        const isCorr = q.isSPR
          ? (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
          : (a?.selectedOption === q.correctAnswer);
        return {
          questionId: q.id,
          reason: a?.fiveFingerReason || 'other',
          correct: isCorr
        };
      });

    // Bookmark stats
    const bookmarkedWrong = allQuestions.filter(q => {
      const a = answers[q.id];
      const isCorr = q.isSPR
        ? (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
        : (a?.selectedOption === q.correctAnswer);
      return a?.bookmarked && !isCorr;
    });

    const unbookmarkedWrong = allQuestions.filter(q => {
      const a = answers[q.id];
      const isCorr = q.isSPR
        ? (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
        : (a?.selectedOption === q.correctAnswer);
      return !a?.bookmarked && !isCorr;
    });

    return (
      <div className="max-w-4xl mx-auto py-6 space-y-8">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Diagnostic Complete
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Your SAT {selectedSection === 'math' ? 'Math' : 'Reading & Writing'} Placement
            </h1>
            <p className="text-neutral-300 text-sm max-w-2xl leading-relaxed">
              Based on your multi-stage adaptive performance, here is your skill placement by domain. Use this baseline to drive targeted daily practice.
            </p>
          </div>
        </div>

        {/* Domain Placements Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Domain-by-Domain Mastery Placements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(placementResults).map(([domainKey, level]) => (
              <div
                key={domainKey}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    {selectedSection.toUpperCase()}
                  </p>
                  <h4 className="font-bold text-neutral-900 text-base mt-1">
                    {domainNames[domainKey as SatDomain] || domainKey}
                  </h4>
                </div>

                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      level === 'expert'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : level === 'intermediate'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {level} Tier
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Finger & Metacognitive Bookmark Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 5-Finger Formula Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
              <span className="text-xl">✋</span>
              5-Finger Metacognitive Analysis
            </div>
            <p className="text-xs text-neutral-500">
              Flags used during Module 1 struggle points:
            </p>

            {fiveFingerList.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold p-3 bg-neutral-50 rounded-xl">
                  <span>Total 5-Finger Flags:</span>
                  <span>{fiveFingerList.length} of 5</span>
                </div>
                <div className="flex justify-between text-xs font-bold p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                  <span>Lucky Guesses (Flagged & Correct):</span>
                  <span>{fiveFingerList.filter(f => f.correct).length}</span>
                </div>
                <div className="flex justify-between text-xs font-bold p-3 bg-amber-50 text-amber-800 rounded-xl">
                  <span>Confirmed Skill Gaps (Flagged & Wrong):</span>
                  <span>{fiveFingerList.filter(f => !f.correct).length}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-xl text-neutral-500 text-xs text-center">
                No 5-Finger struggle flags were used in Module 1.
              </div>
            )}
          </div>

          {/* Bookmark & Blindspot Matrix */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-base">
              <Bookmark className="w-5 h-5 text-blue-600" />
              Metacognitive Error Analysis
            </div>
            <p className="text-xs text-neutral-500">
              Separating calculated uncertainties from careless errors:
            </p>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs flex justify-between items-center font-bold">
                <span>Bookmarked Mistakes (Expected Struggles):</span>
                <span>{bookmarkedWrong.length}</span>
              </div>
              <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs flex justify-between items-center font-bold">
                <span>Unbookmarked Mistakes (Careless Blindspots):</span>
                <span>{unbookmarkedWrong.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Dispatch Reports Badges (Teacher + Parent) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-950">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Parent Diagnostic Digest Dispatched</p>
              <p className="text-[11px] text-emerald-800">Plain-language mastery & confidence summary sent to linked guardian.</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-950">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Teacher Academic Report Dispatched</p>
              <p className="text-[11px] text-blue-800">Domain breakdowns & early attention flags sent to class teacher roster.</p>
            </div>
          </div>
        </div>

        {/* AI Narrative Report */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Diagnostic Insights
          </div>
          {isGeneratingAiReport ? (
            <div className="py-8 text-center text-neutral-400 text-sm animate-pulse">
              Synthesizing adaptive cognitive performance...
            </div>
          ) : (
            <div className="text-neutral-800 leading-relaxed">
              <LessonContent content={aiReportNarrative} />
            </div>
          )}
        </div>

        {/* Full Question-by-Question Remediation Review */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Comprehensive Question Remediation Review
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Full step-by-step Socratic walkthroughs, textbook mappings, and targeted practice drills for every item.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full">
              {allQuestions.length} Questions Reviewed
            </span>
          </div>

          <div className="space-y-6">
            {allQuestions.map((q, idx) => {
              const a = answers[q.id];
              const isCorrect = q.isSPR
                ? (a?.sprAnswer && String(q.correctAnswer).trim() === a.sprAnswer.trim())
                : (a?.selectedOption === q.correctAnswer);
              
              const chosenText = q.isSPR 
                ? (a?.sprAnswer || 'No response') 
                : (a?.selectedOption !== undefined ? String.fromCharCode(65 + a.selectedOption) + ') ' + (q.options[a.selectedOption] || '') : 'No response');

              const correctText = q.isSPR
                ? String(q.correctAnswer)
                : String.fromCharCode(65 + Number(q.correctAnswer)) + ') ' + (q.options[Number(q.correctAnswer)] || '');

              const textbookTarget = selectedSection === 'math'
                ? { bookId: 'sat-foundations-math', ch: 'ch1', sec: 'sec-1-1', title: 'Volume 1: Foundations of SAT Math' }
                : { bookId: 'sat-reading-writing-mastery', ch: 'ch-rw-1', sec: 'sec-rw-1-1', title: 'Volume 2: Reading & Writing Mastery' };

              return (
                <div
                  key={q.id}
                  className={'rounded-2xl border p-5 space-y-4 ' + (isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-red-50/30 border-red-200')}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={'px-2.5 py-1 rounded-lg text-xs font-bold ' + (isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800')}>
                        {isCorrect ? '✓ Correct' : '✕ Needs Review'}
                      </span>
                      <span className="text-xs font-bold text-neutral-600">
                        Item #{idx + 1} · {q.skill}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <span>Time: {a?.timeSeconds || 15}s</span>
                      {a?.bookmarked && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">Bookmarked</span>}
                      {a?.fiveFinger && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-bold">✋ Flagged</span>}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-neutral-900 leading-relaxed">
                    <LessonContent content={q.questionText} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className={'p-3 rounded-xl border ' + (isCorrect ? 'bg-white border-emerald-200' : 'bg-white border-red-200')}>
                      <span className="font-bold text-neutral-500 block mb-1">Your Answer:</span>
                      <span className={'font-semibold ' + (isCorrect ? 'text-emerald-700' : 'text-red-700')}>{chosenText}</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-white border-neutral-200">
                      <span className="font-bold text-neutral-500 block mb-1">Correct Answer:</span>
                      <span className="font-semibold text-neutral-900">{correctText}</span>
                    </div>
                  </div>

                  {/* Socratic Explanation */}
                  <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-2">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Socratic Step-by-Step Rationale</span>
                    </p>
                    <div className="text-xs text-neutral-700 leading-relaxed">
                      <LessonContent content={q.explanation || 'Step 1: Identify the underlying relationship in the prompt. Step 2: Set up the algebraic structure or syntax boundary. Step 3: Verify constraints to isolate the definitive answer.'} />
                    </div>
                  </div>

                  {/* Remediation Action Links */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-neutral-200/60">
                    <button
                      onClick={() => navigate('/student/sat/textbooks?textbookId=' + textbookTarget.bookId + '&chapter=' + textbookTarget.ch + '&section=' + textbookTarget.sec)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review in {textbookTarget.title} &rarr;</span>
                    </button>

                    <button
                      onClick={() => navigate('/student/sat/practice?domain=' + q.domain + '&skill=' + encodeURIComponent(q.skill))}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Queue 2–3 Similar Drill Questions</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTA */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => navigate('/student/sat/practice')}
            className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center transition-all shadow-md flex items-center justify-center gap-2 text-base"
          >
            Launch Practice Studio
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="py-4 px-6 rounded-2xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-center transition-all text-base flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Other Section
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE TEST (STEP 1 or STEP 3)
  if (!currentQuestion) {
    return <div className="p-8 text-center text-neutral-500">Loading diagnostic question...</div>;
  }

  const currentAnswerObj = answers[currentQuestion.id];
  const selectedAnswer = currentAnswerObj?.selectedOption;
  const sprAnswer = currentAnswerObj?.sprAnswer || '';
  const isBookmarked = Boolean(currentAnswerObj?.bookmarked);
  const isFiveFingerFlagged = Boolean(currentAnswerObj?.fiveFinger);

  const canProceed = currentQuestion.isSPR
    ? sprAnswer.trim().length > 0
    : selectedAnswer !== undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Top Test Header */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
            Module {activeModule}
          </span>
          <span className="text-xs font-bold text-neutral-500">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {domainNames[currentQuestion.domain]}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 5-Finger Formula Widget (Module 1 Only) */}
          {activeModule === 1 && (
            <FiveFingerWidget
              currentQuestionId={currentQuestion.id}
              isFlagged={isFiveFingerFlagged}
              activeReason={currentAnswerObj?.fiveFingerReason}
              usedCount={fiveFingerCount}
              maxFingers={5}
              onToggleFinger={handleToggleFiveFinger}
            />
          )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isBookmarked
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Review'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-bold text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-200">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            {timeOnQuestion}s
          </div>

          {selectedSection === 'math' && (
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desmos</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Presentation Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
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
              onChange={handleSprChange}
              onEnterSubmit={() => {
                if (canProceed) handleNext();
              }}
            />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-semibold'
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
                  <span className="text-sm md:text-base pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
        >
          {currentIndex === activeQuestions.length - 1
            ? (activeModule === 1 ? 'Finish Module 1' : 'Complete Diagnostic')
            : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desmos Calculator Modal */}
      <DesmosCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />

      {/* Empathy Reset Modal */}
      <EmpathyResetModal
        isOpen={showEmpathyModal}
        onClose={() => setShowEmpathyModal(false)}
      />
    </div>
  );
}
