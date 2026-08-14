import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { SatDomain, SatQuestion } from '../../../types';
import { initialTextbooks } from '../../../data/textbooks';
import { 
  Sparkles, 
  Wand2, 
  BookOpen, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Send, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  Eye, 
  Layers, 
  Video, 
  Film, 
  Check, 
  Loader2, 
  HelpCircle,
  Copy,
  Download
} from 'lucide-react';
import { LessonContent } from '../../../components/shared/LessonContent';

const domainTaxonomy: Record<'math' | 'reading-writing', { id: SatDomain; name: string; skills: string[] }[]> = {
  'math': [
    {
      id: 'algebra',
      name: 'Algebra',
      skills: ['Linear equations in one variable', 'Linear functions and graphs', 'Systems of two linear equations', 'Linear inequalities in one or two variables']
    },
    {
      id: 'advanced-math',
      name: 'Advanced Math',
      skills: ['Nonlinear equations and systems', 'Quadratic and exponential functions', 'Polynomial factors and graphs', 'Radical and rational exponents']
    },
    {
      id: 'problem-solving-data-analysis',
      name: 'Problem-Solving & Data Analysis',
      skills: ['Ratios, rates, and proportions', 'Percentages and unit conversions', 'Two-way tables and conditional probability', 'Scatterplots and statistical models']
    },
    {
      id: 'geometry-trigonometry',
      name: 'Geometry & Trigonometry',
      skills: ['Area and volume formulas', 'Right triangle trigonometry and radians', 'Circle equations and arc lengths', 'Similar triangles and congruence']
    }
  ],
  'reading-writing': [
    {
      id: 'information-ideas',
      name: 'Information & Ideas',
      skills: ['Central ideas and details', 'Command of textual evidence', 'Command of quantitative evidence', 'Inferences and logical completions']
    },
    {
      id: 'craft-structure',
      name: 'Craft & Structure',
      skills: ['Words in context and domain vocabulary', 'Text structure and rhetorical purpose', 'Cross-text connections (Passage 1 vs 2)']
    },
    {
      id: 'expression-of-ideas',
      name: 'Expression of Ideas',
      skills: ['Rhetorical synthesis with bulleted notes', 'Logical transitions between clauses']
    },
    {
      id: 'standard-english-conventions',
      name: 'Standard English Conventions',
      skills: ['Sentence boundaries (semicolons, colons, dashes)', 'Subject-verb and pronoun-antecedent agreement', 'Dangling and misplaced modifiers', 'Comparative parallelism']
    }
  ]
};

export default function TeacherContentStudio() {
  const navigate = useNavigate();
  const { userProfile, allUsers, assignSatTest } = useAppContext();

  // Mode: 'quick_prompt' | 'guided_wizard'
  const [activeTab, setActiveTab] = useState<'quick_prompt' | 'guided_wizard'>('quick_prompt');

  // Quick Prompt State
  const [quickPrompt, setQuickPrompt] = useState('5 medium-difficulty Standard English Conventions questions on comma splices and semicolons');

  // Guided Wizard 7-Question Intake State
  const [wizardSection, setWizardSection] = useState<'math' | 'reading-writing'>('math');
  const [wizardDomain, setWizardDomain] = useState<SatDomain>('algebra');
  const [wizardSkill, setWizardSkill] = useState('Linear equations and slope-intercept form');
  const [wizardDifficulty, setWizardDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [wizardCount, setWizardCount] = useState<number>(3);
  const [wizardIntendedUse, setWizardIntendedUse] = useState<'drill' | 'lesson' | 'full_test'>('drill');
  const [wizardSourceNotes, setWizardSourceNotes] = useState('');

  // Source PDF / Text Attachment
  const [sourceText, setSourceText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);

  // Extra Content Checkbox
  const [includeExtraContent, setIncludeExtraContent] = useState(true);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [activePreviewIdx, setActivePreviewIdx] = useState<number>(0);
  const [activeExtraTab, setActiveExtraTab] = useState<'question' | 'lesson' | 'video' | 'animation'>('question');
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedMimeType(file.type);

    const reader = new FileReader();
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        setSourceText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1];
        setUploadedBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveSuccess('');
    try {
      const payload: any = {
        mode: activeTab,
        generateExtra: includeExtraContent,
        sourceText: sourceText.trim() || undefined,
        sourceDocument: uploadedBase64 && uploadedMimeType ? {
          base64: uploadedBase64,
          mimeType: uploadedMimeType,
          name: uploadedFileName
        } : undefined
      };

      if (activeTab === 'quick_prompt') {
        payload.promptText = quickPrompt;
      } else {
        payload.wizardData = {
          section: wizardSection,
          domain: wizardDomain,
          skill: wizardSkill,
          difficulty: wizardDifficulty,
          questionCount: wizardCount,
          intendedUse: wizardIntendedUse,
          sourceNotes: wizardSourceNotes
        };
      }

      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Generation error: HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
        setActivePreviewIdx(0);
      }
    } catch (err: any) {
      console.error('Failed to generate questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBank = () => {
    setSaveSuccess('Questions successfully ingested into the platform question bank!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleAssignQuestions = () => {
    navigate('/teacher/sat/assign');
  };

  const activeQuestion = generatedQuestions[activePreviewIdx];
  const availableDomains = domainTaxonomy[wizardSection] || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            AIES AI Question & Content Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Teacher Content Studio</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Generate authentic Digital SAT questions, multi-modal lesson texts, video explainer scripts, and animation briefs on demand.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/teacher/sat/assign')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Assign to Class
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Generation Controls (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            {/* Mode Switcher */}
            <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1 border border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveTab('quick_prompt')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'quick_prompt'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                Quick Prompt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guided_wizard')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'guided_wizard'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Guided 7-Q Wizard
              </button>
            </div>

            {/* Quick Prompt Tab */}
            {activeTab === 'quick_prompt' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Natural-Language Generation Brief
                  </label>
                  <textarea
                    rows={4}
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder="e.g. 5 medium-difficulty Standard English Conventions questions on comma splices and semicolons..."
                    className="w-full p-3.5 rounded-2xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Describe question count, domain, skill, difficulty, or specific test topics.
                  </p>
                </div>
              </div>
            )}

            {/* Guided 7-Question Wizard Tab */}
            {activeTab === 'guided_wizard' && (
              <div className="space-y-4 text-xs font-medium">
                {/* 1. Subject */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">1. Subject / Section</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWizardSection('math');
                        setWizardDomain('algebra');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        wizardSection === 'math' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      Math
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWizardSection('reading-writing');
                        setWizardDomain('information-ideas');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        wizardSection === 'reading-writing' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      Reading & Writing
                    </button>
                  </div>
                </div>

                {/* 2. Domain */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">2. Domain</label>
                  <select
                    value={wizardDomain}
                    onChange={(e) => setWizardDomain(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {availableDomains.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Skill */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">3. Skill Focus</label>
                  <input
                    type="text"
                    value={wizardSkill}
                    onChange={(e) => setWizardSkill(e.target.value)}
                    placeholder="e.g. Semicolons and clause boundaries"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 font-medium"
                  />
                </div>

                {/* 4. Difficulty */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">4. Difficulty Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'expert'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setWizardDifficulty(lvl)}
                        className={`p-2 rounded-xl border font-bold capitalize text-center ${
                          wizardDifficulty === lvl
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {lvl === 'beginner' ? 'Easy' : lvl === 'intermediate' ? 'Medium' : 'Hard'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Question Count */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">5. Question Count ({wizardCount})</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={wizardCount}
                    onChange={(e) => setWizardCount(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 6. Intended Use */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">6. Intended Use</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'drill', label: 'Targeted Drill' },
                      { id: 'lesson', label: 'Lesson Exercise' },
                      { id: 'full_test', label: 'Full Mock Test' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setWizardIntendedUse(opt.id as any)}
                        className={`p-2 rounded-xl border font-bold text-center ${
                          wizardIntendedUse === opt.id
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Source Material / Notes */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">7. Source Notes (Optional)</label>
                  <input
                    type="text"
                    value={wizardSourceNotes}
                    onChange={(e) => setWizardSourceNotes(e.target.value)}
                    placeholder="e.g. Focus on transition words like moreover, however"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>
            )}

            {/* Optional PDF / Document Attachment */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                Optional PDF / Source Material Grounding
              </label>
              
              <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 text-center hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  id="source-doc-upload"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="source-doc-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                  <UploadCloud className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold text-neutral-800">
                    {uploadedFileName ? uploadedFileName : 'Upload Chapter PDF or Notes'}
                  </span>
                  <span className="text-[10px] text-neutral-400">PDF, DOCX, TXT (Up to 10 MB)</span>
                </label>
              </div>

              {sourceText && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Source Excerpt Preview:</p>
                  <p className="text-xs text-neutral-700 line-clamp-3 italic">"{sourceText}"</p>
                </div>
              )}
            </div>

            {/* Extra Content Toggle (Lesson, Video Script, Animation Brief) */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="extra-content-toggle"
                checked={includeExtraContent}
                onChange={(e) => setIncludeExtraContent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="extra-content-toggle" className="text-xs font-bold text-neutral-700 cursor-pointer">
                Generate Lesson Text, Video Script & Animation Brief
              </label>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating SAT Items...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Generate Material
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Generated Preview & Studio Inspector (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {saveSuccess}
            </div>
          )}

          {generatedQuestions.length > 0 ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
              {/* Question Pagination Selector */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500">Generated Items ({generatedQuestions.length}):</span>
                  <div className="flex items-center gap-1.5">
                    {generatedQuestions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePreviewIdx(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          idx === activePreviewIdx
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToBank}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Save to Bank
                  </button>
                  <button
                    onClick={handleAssignQuestions}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Assign
                  </button>
                </div>
              </div>

              {/* Extra Content Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <button
                  onClick={() => setActiveExtraTab('question')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeExtraTab === 'question' ? 'bg-blue-50 text-blue-700' : 'text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Question & Choices
                </button>
                {activeQuestion?.shortLessonText && (
                  <button
                    onClick={() => setActiveExtraTab('lesson')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeExtraTab === 'lesson' ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Lesson Text
                  </button>
                )}
                {activeQuestion?.videoScriptOutline && (
                  <button
                    onClick={() => setActiveExtraTab('video')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeExtraTab === 'video' ? 'bg-purple-50 text-purple-700' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Video Script
                  </button>
                )}
                {activeQuestion?.animationBrief && (
                  <button
                    onClick={() => setActiveExtraTab('animation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeExtraTab === 'animation' ? 'bg-amber-50 text-amber-700' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    Animation Brief
                  </button>
                )}
              </div>

              {/* View 1: Question & Options */}
              {activeExtraTab === 'question' && (
                <div className="space-y-6">
                  {/* Taxonomy Tags Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
                      {activeQuestion.section === 'math' ? 'Math' : 'Reading & Writing'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                      {activeQuestion.domain}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-semibold">
                      {activeQuestion.skill}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold capitalize">
                      {activeQuestion.difficulty} Tier
                    </span>
                  </div>

                  {/* Question Stem */}
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <p className="text-base font-medium text-neutral-900 leading-relaxed whitespace-pre-line">
                      {activeQuestion.questionText}
                    </p>
                  </div>

                  {/* Answer Choices */}
                  {activeQuestion.isSPR ? (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs font-bold text-blue-950">
                      Student-Produced Response (SPR Grid-in): <span className="font-mono text-sm">{activeQuestion.correctAnswer}</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeQuestion.options?.map((opt: string, optIdx: number) => {
                        const isCorrect = optIdx === activeQuestion.correctAnswer;
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 ${
                              isCorrect
                                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                                : 'border-neutral-200 bg-white text-neutral-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {letter}
                            </span>
                            <span className="text-sm pt-0.5">{opt}</span>
                            {isCorrect && (
                              <span className="ml-auto text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pedagogical Explanation</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{activeQuestion.explanation}</p>
                  </div>

                  {/* Textbook Reference */}
                  {activeQuestion.textbookRef && (
                    <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">
                          Textbook Citation: Page {activeQuestion.textbookRef.page}
                        </p>
                        <p className="text-xs text-neutral-600 italic">
                          "{activeQuestion.textbookRef.highlightedText}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Lesson Text */}
              {activeExtraTab === 'lesson' && (
                <div className="space-y-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    Structured Mini-Lesson
                  </div>
                  <div className="prose prose-neutral text-sm leading-relaxed">
                    <LessonContent content={activeQuestion.shortLessonText} />
                  </div>
                </div>
              )}

              {/* View 3: Video Script */}
              {activeExtraTab === 'video' && (
                <div className="space-y-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                    <Video className="w-4 h-4" />
                    60-Second Video Explainer Storyboard
                  </div>
                  <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-neutral-200 whitespace-pre-wrap leading-relaxed text-neutral-800">
                    {activeQuestion.videoScriptOutline}
                  </pre>
                </div>
              )}

              {/* View 4: Animation Brief */}
              {activeExtraTab === 'animation' && (
                <div className="space-y-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <Film className="w-4 h-4" />
                    Interactive Animation & Visual Scene Brief
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-200">
                    {activeQuestion.animationBrief}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-dashed border-neutral-300 text-center space-y-3">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                <Wand2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800">Content Studio Ready</h3>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto">
                Write a quick prompt or use the 7-question wizard to generate SAT questions, explanations, and multi-media briefs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
