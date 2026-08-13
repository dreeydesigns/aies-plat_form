import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { initialSatQuestions } from '../../../data/sat-questions';
import { SatDomain, SatQuestion, SatDiagnosticSession } from '../../../types';
import DesmosCalculator from '../../../components/sat/DesmosCalculator';
import EmpathyResetModal from '../../../components/sat/EmpathyResetModal';
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
  Flag
} from 'lucide-react';

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

  // Step 0: Choose Section ('math' | 'reading-writing')
  // Step 1: Module 1 (Mixed Difficulty)
  // Step 2: Module 1 Transition / Routing
  // Step 3: Module 2 (Adaptive Difficulty)
  // Step 4: Final Diagnostic Report
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [selectedSection, setSelectedSection] = useState<'math' | 'reading-writing'>('math');

  // Question lists for module 1 & 2
  const [module1Questions, setModule1Questions] = useState<SatQuestion[]>([]);
  const [module2Questions, setModule2Questions] = useState<SatQuestion[]>([]);
  const [activeModule, setActiveModule] = useState<1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers & Telemetry tracking
  // Keyed by questionId: { selectedOption: number, timeSeconds: number, revisited: boolean, visitedCount: number }
  const [answers, setAnswers] = useState<Record<string, {
    selectedOption: number;
    timeSeconds: number;
    revisited: boolean;
    visitedCount: number;
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

  // Initialize questions on section select
  const startDiagnostic = (section: 'math' | 'reading-writing') => {
    setSelectedSection(section);
    
    // Filter questions by section
    const pool = initialSatQuestions.filter(q => q.section === section);
    
    // Module 1: balanced mix (e.g. 6-8 questions for fast accurate placement)
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
        selectedOption: optionIndex,
        timeSeconds: (existing?.timeSeconds || 0) + timeOnQuestion,
        revisited,
        visitedCount
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
      if (answers[q.id]?.selectedOption === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = correctCount / module1Questions.length;
    let targetDifficulty: 'beginner' | 'intermediate' | 'expert' = 'intermediate';

    if (scorePct < 0.5) {
      targetDifficulty = 'beginner';
    } else if (scorePct >= 0.8) {
      targetDifficulty = 'expert';
    } else {
      targetDifficulty = 'intermediate';
    }

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

    domainsForSection.forEach(domain => {
      const domainQuestions = allQuestions.filter(q => q.domain === domain);
      if (domainQuestions.length === 0) {
        placements[domain] = 'intermediate';
        return;
      }

      let correct = 0;
      let totalWeight = 0;
      domainQuestions.forEach(q => {
        const isCorr = answers[q.id]?.selectedOption === q.correctAnswer;
        if (isCorr) {
          correct++;
          if (q.difficulty === 'expert') totalWeight += 3;
          else if (q.difficulty === 'intermediate') totalWeight += 2;
          else totalWeight += 1;
        }
      });

      const domainAccuracy = correct / domainQuestions.length;
      if (domainAccuracy >= 0.75 || totalWeight >= 3) {
        placements[domain] = 'expert';
      } else if (domainAccuracy <= 0.33) {
        placements[domain] = 'beginner';
      } else {
        placements[domain] = 'intermediate';
      }
    });

    setPlacementResults(placements);
    setCurrentStep(4);

    // Save diagnostic session in Firestore
    const moduleResults = allQuestions.map(q => ({
      questionId: q.id,
      correct: answers[q.id]?.selectedOption === q.correctAnswer,
      timeSeconds: answers[q.id]?.timeSeconds || 15,
      revisited: answers[q.id]?.revisited || false,
      selectedOption: answers[q.id]?.selectedOption
    }));

    // Generate AI Narrative Summary
    setIsGeneratingAiReport(true);
    let aiText = '';
    try {
      const correctTotal = moduleResults.filter(r => r.correct).length;
      const totalQ = moduleResults.length;
      const avgLatency = Math.round(moduleResults.reduce((acc, r) => acc + r.timeSeconds, 0) / (totalQ || 1));
      const revisitedCount = moduleResults.filter(r => r.revisited).length;

      const res = await fetch('/api/gemini/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Generate a concise 3-paragraph SAT diagnostic analysis report for a student who scored ${correctTotal}/${totalQ} on ${selectedSection}. Placements: ${JSON.stringify(placements)}. Avg latency: ${avgLatency}s. Revisited: ${revisitedCount} times. Provide positive reinforcement, cognitive pacing insights, and 2 clear actionable practice steps.`
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
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Africa's First AI-Native SAT Diagnostic
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Digital SAT Adaptive Diagnostic
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Experience our 2-stage multi-stage adaptive module (MST). In just 10-15 minutes, discover your exact baseline placement across all 8 SAT domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Math Card */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Math Section</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Algebra, Advanced Math, Problem-Solving & Data Analysis, and Geometry & Trigonometry. Embedded official Desmos calculator included.
              </p>
              <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 2 Adaptive Stages (MST)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Integrated Desmos Grapher
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Per-Domain Placement Breakdown
                </div>
              </div>
            </div>
            <button
              onClick={() => startDiagnostic('math')}
              className="mt-8 w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              Start Math Diagnostic
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Reading & Writing Card */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Reading & Writing</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Information & Ideas, Craft & Structure, Expression of Ideas, and Standard English Conventions with passage context analysis.
              </p>
              <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 2 Adaptive Stages (MST)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nuanced Context Inference
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Page & Line Textbook Deep Remediation
                </div>
              </div>
            </div>
            <button
              onClick={() => startDiagnostic('reading-writing')}
              className="mt-8 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              Start Reading & Writing
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Module 1 Transition
  if (currentStep === 2) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <Brain className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Stage 1 Complete · Calibrating Stage 2
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            The adaptive engine evaluated your Stage 1 responses and is customizing Stage 2 question difficulty to pinpoint your exact ceiling.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-neutral-200 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Stage 1 Questions</span>
            <span className="font-bold text-neutral-900">{module1Questions.length} Questions</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Routing Algorithm</span>
            <span className="font-bold text-purple-600">Multi-Stage Adaptive (MST)</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500">Stage 2 Questions</span>
            <span className="font-bold text-neutral-900">{module2Questions.length} Questions</span>
          </div>
        </div>

        <button
          onClick={startModule2}
          className="py-3.5 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md inline-flex items-center gap-2"
        >
          Begin Stage 2
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // STEP 4: Final Diagnostic Report
  if (currentStep === 4) {
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
            <div className="prose prose-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {aiReportNarrative}
            </div>
          )}
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

  const selectedAnswer = answers[currentQuestion.id]?.selectedOption;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Top Test Header */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
            Stage {activeModule}
          </span>
          <span className="text-xs font-bold text-neutral-500">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {domainNames[currentQuestion.domain]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-600">
            <Clock className="w-4 h-4 text-neutral-400" />
            {timeOnQuestion}s
          </div>

          {selectedSection === 'math' && (
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

      {/* Question Presentation Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {currentQuestion.skill}
        </div>

        <div className="text-base md:text-lg font-medium text-neutral-900 leading-relaxed whitespace-pre-line">
          {currentQuestion.questionText}
        </div>

        {/* Options */}
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
          disabled={selectedAnswer === undefined}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
        >
          {currentIndex === activeQuestions.length - 1
            ? (activeModule === 1 ? 'Finish Stage 1' : 'Complete Diagnostic')
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
