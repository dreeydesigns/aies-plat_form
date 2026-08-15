import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initialTextbooks } from '../../../data/textbooks';
import { initialSatQuestions } from '../../../data/sat-questions';
import { 
  Textbook, 
  TextbookChapter, 
  TextbookSection, 
  TextbookPage, 
  SatQuestion,
  SatSubjectSection,
  SatDomain 
} from '../../../types';
import { LessonContent } from '../../../components/shared/LessonContent';
import SprInput from '../../../components/sat/SprInput';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Highlighter, 
  ArrowLeft, 
  Bookmark, 
  Check, 
  FileText,
  Share2,
  Sparkles,
  Zap,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  Filter,
  History,
  Target,
  BookMarked,
  Link as LinkIcon,
  Compass,
  GraduationCap,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const normalizeTextbookId = (id: string | null | undefined): string => {
  if (!id) return '';
  if (id === 'sat-math-foundations' || id === 'sat-foundations-math') return 'sat-foundations-math';
  if (id === 'sat-rw-mastery' || id === 'sat-reading-writing-mastery') return 'sat-reading-writing-mastery';
  if (id === 'sat-adv-math' || id === 'sat-advanced-math-mastery') return 'sat-advanced-math-mastery';
  if (id === 'sat-grammar' || id === 'sat-grammar-conventions') return 'sat-grammar-conventions';
  return id;
};

// Domain Taxonomy Mappings
export const DOMAIN_SUBJECT_MAP: Record<SatDomain, SatSubjectSection> = {
  'algebra': 'math',
  'advanced-math': 'math',
  'problem-solving-data-analysis': 'math',
  'geometry-trigonometry': 'math',
  'information-ideas': 'reading-writing',
  'craft-structure': 'reading-writing',
  'expression-of-ideas': 'reading-writing',
  'standard-english-conventions': 'reading-writing'
};

export const DOMAIN_NAMES: Record<SatDomain, string> = {
  'algebra': 'Algebra',
  'advanced-math': 'Advanced Math',
  'problem-solving-data-analysis': 'Problem-Solving & Data Analysis',
  'geometry-trigonometry': 'Geometry & Trigonometry',
  'information-ideas': 'Information & Ideas',
  'craft-structure': 'Craft & Structure',
  'expression-of-ideas': 'Expression of Ideas',
  'standard-english-conventions': 'Standard English Conventions'
};

interface SearchSectionResult {
  textbook: Textbook;
  chapter: TextbookChapter;
  section: TextbookSection;
  matchedField: string;
  excerpt: string;
}

export default function SatTextbooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Params
  const textbookIdParam = searchParams.get('textbookId') || searchParams.get('book');
  const chapterParam = searchParams.get('chapter');
  const sectionParam = searchParams.get('section');
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const highlightParam = searchParams.get('highlight') || '';

  // 4-Stage Progressive Navigator State
  const [navSubject, setNavSubject] = useState<SatSubjectSection | 'all'>(() => {
    const s = searchParams.get('subject');
    return (s === 'math' || s === 'reading-writing') ? s : 'all';
  });

  const [navDomain, setNavDomain] = useState<SatDomain | 'all'>(() => {
    const d = searchParams.get('domain') as SatDomain | null;
    return d && DOMAIN_NAMES[d] ? d : 'all';
  });

  const [navSkill, setNavSkill] = useState<string>('all');
  const [navDifficulty, setNavDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active Reader State
  const [selectedBook, setSelectedBook] = useState<Textbook | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Reader Modes & Tabs
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [activeReaderTab, setActiveReaderTab] = useState<'lesson' | 'qa-drill' | 'changelog'>('lesson');
  const [copiedLink, setCopiedLink] = useState(false);

  // Q&A Two-Pane State
  const [activeDrillQuestionId, setActiveDrillQuestionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sprAnswer, setSprAnswer] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Initialize and synchronize route parameters
  useEffect(() => {
    if (textbookIdParam) {
      const normId = normalizeTextbookId(textbookIdParam);
      const book = initialTextbooks.find(b => b.id === normId || b.id === textbookIdParam);
      if (book) {
        setSelectedBook(book);

        // Expand chapters in active book
        const expandMap: Record<string, boolean> = {};
        book.chapters?.forEach(ch => {
          expandMap[ch.id] = true;
        });
        setExpandedChapters(expandMap);

        // Chapter & Section Sync
        if (chapterParam && book.chapters) {
          const ch = book.chapters.find(c => c.id === chapterParam);
          if (ch) {
            setActiveChapterId(ch.id);
            if (sectionParam) {
              const sec = ch.sections.find(s => s.id === sectionParam);
              if (sec) {
                setActiveSectionId(sec.id);
                if (sec.featuredQuestionId) setActiveDrillQuestionId(sec.featuredQuestionId);
              }
            } else if (ch.sections[0]) {
              setActiveSectionId(ch.sections[0].id);
              if (ch.sections[0].featuredQuestionId) setActiveDrillQuestionId(ch.sections[0].featuredQuestionId);
            }
          }
        } else if (book.chapters && book.chapters.length > 0) {
          const firstCh = book.chapters[0];
          setActiveChapterId(firstCh.id);
          if (firstCh.sections[0]) {
            setActiveSectionId(firstCh.sections[0].id);
            if (firstCh.sections[0].featuredQuestionId) setActiveDrillQuestionId(firstCh.sections[0].featuredQuestionId);
          }
        }

        // Backward compatibility for page param
        if (pageParam > 0 && book.pages) {
          const pageIdx = book.pages.findIndex(p => p.pageNumber === pageParam);
          if (pageIdx !== -1) {
            setCurrentPageIndex(pageIdx);
          }
        }
      }
    } else {
      setSelectedBook(null);
    }
  }, [textbookIdParam, chapterParam, sectionParam, pageParam]);

  // Scroll to highlight if present
  useEffect(() => {
    if (highlightParam && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightParam, selectedBook, activeSectionId, currentPageIndex]);

  // Current active Chapter & Section objects
  const activeChapter = useMemo(() => {
    if (!selectedBook?.chapters) return null;
    return selectedBook.chapters.find(c => c.id === activeChapterId) || selectedBook.chapters[0] || null;
  }, [selectedBook, activeChapterId]);

  const activeSection = useMemo(() => {
    if (!activeChapter?.sections) return null;
    return activeChapter.sections.find(s => s.id === activeSectionId) || activeChapter.sections[0] || null;
  }, [activeChapter, activeSectionId]);

  // All extracted sections across the curriculum
  const allSections = useMemo(() => {
    const list: Array<{
      textbook: Textbook;
      chapter: TextbookChapter;
      section: TextbookSection;
    }> = [];

    initialTextbooks.forEach(b => {
      b.chapters?.forEach(c => {
        c.sections?.forEach(s => {
          list.push({ textbook: b, chapter: c, section: s });
        });
      });
    });

    return list;
  }, []);

  // Filtered domains based on selected Subject
  const availableDomains = useMemo(() => {
    const domains: SatDomain[] = [
      'algebra',
      'advanced-math',
      'problem-solving-data-analysis',
      'geometry-trigonometry',
      'information-ideas',
      'craft-structure',
      'expression-of-ideas',
      'standard-english-conventions'
    ];

    if (navSubject === 'all') return domains;
    return domains.filter(d => DOMAIN_SUBJECT_MAP[d] === navSubject);
  }, [navSubject]);

  // Filtered skills based on selected Subject and Domain
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    allSections.forEach(({ textbook, chapter, section }) => {
      const matchSubject = navSubject === 'all' || textbook.subject === navSubject;
      const matchDomain = navDomain === 'all' || chapter.domain === navDomain;
      if (matchSubject && matchDomain && section.skill) {
        skillSet.add(section.skill);
      }
    });
    return Array.from(skillSet);
  }, [allSections, navSubject, navDomain]);

  // Filtered sections matching the 4-Stage Navigator
  const filteredNavigatorSections = useMemo(() => {
    return allSections.filter(({ textbook, chapter, section }) => {
      const matchSubject = navSubject === 'all' || textbook.subject === navSubject;
      const matchDomain = navDomain === 'all' || chapter.domain === navDomain;
      const matchSkill = navSkill === 'all' || section.skill === navSkill;
      const matchDiff = navDifficulty === 'all' || section.workedExamples.some(ex => ex.difficulty === navDifficulty);
      return matchSubject && matchDomain && matchSkill && matchDiff;
    });
  }, [allSections, navSubject, navDomain, navSkill, navDifficulty]);

  // Progressive Navigator Handlers
  const handleSelectNavSubject = (subject: SatSubjectSection | 'all') => {
    setNavSubject(subject);
    setNavDomain('all');
    setNavSkill('all');
    updateFilterParams(subject, 'all', 'all', navDifficulty);
  };

  const handleSelectNavDomain = (domain: SatDomain | 'all') => {
    setNavDomain(domain);
    setNavSkill('all');
    if (domain !== 'all') {
      const parentSub = DOMAIN_SUBJECT_MAP[domain];
      setNavSubject(parentSub);
      updateFilterParams(parentSub, domain, 'all', navDifficulty);
    } else {
      updateFilterParams(navSubject, 'all', 'all', navDifficulty);
    }
  };

  const handleSelectNavSkill = (skill: string) => {
    setNavSkill(skill);
    updateFilterParams(navSubject, navDomain, skill, navDifficulty);
  };

  const handleSelectNavDifficulty = (diff: 'all' | 'easy' | 'medium' | 'hard') => {
    setNavDifficulty(diff);
    updateFilterParams(navSubject, navDomain, navSkill, diff);
  };

  const handleResetFilters = () => {
    setNavSubject('all');
    setNavDomain('all');
    setNavSkill('all');
    setNavDifficulty('all');
    setSearchParams({});
  };

  const updateFilterParams = (
    s: SatSubjectSection | 'all',
    d: SatDomain | 'all',
    sk: string,
    df: 'all' | 'easy' | 'medium' | 'hard'
  ) => {
    const params: Record<string, string> = {};
    if (s !== 'all') params.subject = s;
    if (d !== 'all') params.domain = d;
    if (sk !== 'all') params.skill = sk;
    if (df !== 'all') params.difficulty = df;
    setSearchParams(params);
  };

  // Open Section in Reader
  const handleOpenSectionInReader = (book: Textbook, chapterId: string, sectionId: string, pageNumber: number) => {
    setSelectedBook(book);
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId);
    setActiveReaderTab('lesson');
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setSprAnswer('');

    const targetChapter = book.chapters?.find(c => c.id === chapterId);
    const targetSection = targetChapter?.sections.find(s => s.id === sectionId);
    if (targetSection?.featuredQuestionId) {
      setActiveDrillQuestionId(targetSection.featuredQuestionId);
    }

    setSearchParams({
      textbookId: book.id,
      chapter: chapterId,
      section: sectionId,
      page: pageNumber.toString()
    });
  };

  // Open Book from Landing Card
  const handleSelectBook = (book: Textbook) => {
    setSelectedBook(book);
    const firstChapter = book.chapters?.[0];
    const firstSection = firstChapter?.sections?.[0];
    
    setActiveChapterId(firstChapter?.id || '');
    setActiveSectionId(firstSection?.id || '');
    setCurrentPageIndex(0);
    setActiveReaderTab('lesson');
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setSprAnswer('');

    setSearchParams({
      textbookId: book.id,
      chapter: firstChapter?.id || '',
      section: firstSection?.id || '',
      page: (firstSection?.pageNumber || 1).toString()
    });
  };

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Semantic & Full-Text AI Search across all sections (Top 5 results)
  const searchResults: SearchSectionResult[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchSectionResult[] = [];

    initialTextbooks.forEach(book => {
      book.chapters?.forEach(chapter => {
        chapter.sections?.forEach(section => {
          let score = 0;
          let matchedField = 'General Content';
          let excerpt = section.conceptSummary;

          if (section.title.toLowerCase().includes(q)) {
            score += 100;
            matchedField = 'Section Title';
          }
          if (section.skill.toLowerCase().includes(q)) {
            score += 80;
            matchedField = 'Tested Skill';
          }
          if (section.conceptSummary.toLowerCase().includes(q)) {
            score += 60;
            matchedField = 'Core Concept';
          }
          
          section.workedExamples?.forEach(ex => {
            if (ex.problem.toLowerCase().includes(q) || ex.solution.toLowerCase().includes(q)) {
              score += 40;
              matchedField = 'Worked Example';
              excerpt = ex.problem;
            }
          });

          section.commonMistakes?.forEach(m => {
            if (m.toLowerCase().includes(q)) {
              score += 30;
              matchedField = 'Common Trap';
              excerpt = m;
            }
          });

          // Semantic synonym triggers
          if (q.includes('run-on') || q.includes('comma splice') || q.includes('semicolon')) {
            if (section.skill.toLowerCase().includes('boundaries') || section.title.toLowerCase().includes('boundaries')) {
              score += 90;
              matchedField = 'Grammar Rule';
            }
          }
          if (q.includes('vocab') || q.includes('word in context') || q.includes('tone')) {
            if (section.skill.toLowerCase().includes('words in context')) {
              score += 90;
              matchedField = 'Vocabulary Strategy';
            }
          }
          if (q.includes('parabola') || q.includes('vertex') || q.includes('quadratic')) {
            if (section.skill.toLowerCase().includes('vertex') || section.skill.toLowerCase().includes('quadratic')) {
              score += 90;
              matchedField = 'Quantitative Method';
            }
          }

          if (score > 0) {
            results.push({
              textbook: book,
              chapter,
              section,
              matchedField,
              excerpt: excerpt.length > 140 ? excerpt.substring(0, 140) + '...' : excerpt
            });
          }
        });
      });
    });

    return results.slice(0, 5);
  }, [searchQuery]);

  // Featured Drill Question in Two-Pane View
  const featuredQuestion: SatQuestion | null = useMemo(() => {
    if (activeDrillQuestionId) {
      const found = initialSatQuestions.find(q => q.id === activeDrillQuestionId);
      if (found) return found;
    }
    if (activeSection?.featuredQuestionId) {
      const found = initialSatQuestions.find(q => q.id === activeSection.featuredQuestionId);
      if (found) return found;
    }
    if (activeChapter?.domain) {
      return initialSatQuestions.find(q => q.domain === activeChapter.domain) || null;
    }
    return null;
  }, [activeDrillQuestionId, activeSection, activeChapter]);

  // Similar Questions list for Left Pane drill
  const similarQuestions: SatQuestion[] = useMemo(() => {
    if (!featuredQuestion) return [];
    return initialSatQuestions
      .filter(q => q.id !== featuredQuestion.id && (q.skill === featuredQuestion.skill || q.domain === featuredQuestion.domain))
      .slice(0, 4);
  }, [featuredQuestion]);

  const handleSelectDrillQuestion = (qId: string) => {
    setActiveDrillQuestionId(qId);
    setSelectedOption(null);
    setSprAnswer('');
    setIsAnswerSubmitted(false);
  };

  const handleCheckDrillAnswer = () => {
    if (!featuredQuestion) return;
    setIsAnswerSubmitted(true);
  };

  // Grouped textbooks
  const mathTextbooks = useMemo(() => {
    return initialTextbooks.filter(b => b.subject === 'math');
  }, []);

  const rwTextbooks = useMemo(() => {
    return initialTextbooks.filter(b => b.subject === 'reading-writing');
  }, []);

  const hasActiveFilters = navSubject !== 'all' || navDomain !== 'all' || navSkill !== 'all' || navDifficulty !== 'all';

  // =========================================================================
  // VIEW 1: LIBRARY LANDING & DYNAMIC 4-STAGE NAVIGATOR
  // =========================================================================
  if (!selectedBook) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 py-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Digital SAT Curriculum & Reference Library</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Textbook Library
          </h1>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            Progressively filter by Subject, Domain, Skill, and Difficulty to locate exact lesson methods, worked models, and Q&A drills in taps.
          </p>
        </div>

        {/* AI-Enabled Semantic Search Bar */}
        <div className="relative">
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-neutral-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm transition-all">
            <Search className="w-5 h-5 text-neutral-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search concepts, methods, formulas, or grammar rules (e.g. 'Words in Context', 'Vertex Form', 'Comma Splices')..."
              className="w-full px-3 py-3.5 text-sm bg-transparent outline-hidden text-neutral-900 placeholder:text-neutral-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-700 bg-neutral-100 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Top 5 Ranked Section-Level Search Results */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-neutral-200 shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Top 5 Section-Level Results for "{searchQuery}"
                </span>
                <span className="text-xs text-neutral-400">
                  {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleOpenSectionInReader(res.textbook, res.chapter.id, res.section.id, res.section.pageNumber);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3.5 rounded-2xl hover:bg-blue-50/60 border border-neutral-100 hover:border-blue-200 transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            res.textbook.subject === 'math'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {res.textbook.subject === 'math' ? '📐 Math' : '📖 Reading & Writing'}
                          </span>
                          <span className="text-xs font-semibold text-neutral-400">
                            {res.textbook.title} &gt; {res.chapter.title}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                          Section {res.section.sectionNumber} — {res.section.title}
                        </p>

                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          <LessonContent content={res.excerpt} />
                        </p>
                      </div>

                      <div className="shrink-0 pt-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-neutral-500">
                  No matching sections found for "{searchQuery}". Try searching for broader terms like "Linear Equations", "Punctuation", or "Inferences".
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. DYNAMIC 4-STAGE NAVIGATOR (Sticky Filter Bar) */}
        <div className="sticky top-2 z-40 bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/90 shadow-sm p-4 space-y-3">
          {/* Top Bar: Title, Result Count & Mobile Filter Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-neutral-600">
                DYNAMIC NAVIGATOR
              </span>
              <span className="text-xs font-bold text-blue-600 ml-1">
                • Showing {filteredNavigatorSections.length} {filteredNavigatorSections.length === 1 ? 'section' : 'sections'}
                {navDomain !== 'all' ? ` in ${DOMAIN_NAMES[navDomain]}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
              </button>
            </div>
          </div>

          {/* Desktop 4-Stage Progressive Dropdown Selectors */}
          <div className="hidden md:grid md:grid-cols-4 gap-3 pt-1">
            {/* Stage 1: Subject */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                1. Subject
              </label>
              <select
                value={navSubject}
                onChange={e => handleSelectNavSubject(e.target.value as any)}
                aria-label="Filter by Subject"
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50/70 text-neutral-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              >
                <option value="all">All Subjects (2)</option>
                <option value="math">📐 Math</option>
                <option value="reading-writing">📖 Reading & Writing</option>
              </select>
            </div>

            {/* Stage 2: Domain */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                2. Domain
              </label>
              <select
                value={navDomain}
                onChange={e => handleSelectNavDomain(e.target.value as any)}
                aria-label="Filter by Domain"
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50/70 text-neutral-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              >
                <option value="all">All Domains ({availableDomains.length})</option>
                {availableDomains.map(d => (
                  <option key={d} value={d}>
                    {DOMAIN_NAMES[d]}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage 3: Skill */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                3. Skill
              </label>
              <select
                value={navSkill}
                onChange={e => handleSelectNavSkill(e.target.value)}
                aria-label="Filter by Skill"
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50/70 text-neutral-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              >
                <option value="all">All Skills ({availableSkills.length})</option>
                {availableSkills.map(sk => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage 4: Difficulty (Optional) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                4. Difficulty Tier
              </label>
              <select
                value={navDifficulty}
                onChange={e => handleSelectNavDifficulty(e.target.value as any)}
                aria-label="Filter by Difficulty Tier"
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50/70 text-neutral-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              >
                <option value="all">All Difficulty Tiers</option>
                <option value="easy">Easy Models</option>
                <option value="medium">Medium Models</option>
                <option value="hard">Hard Models</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Stacked Filter Sheet Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end md:hidden">
            <div className="bg-white rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-base font-bold text-neutral-900">
                  Progressive Library Filters
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-xl bg-neutral-100 text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Stage 1 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    1. Subject
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'math', 'reading-writing'].map(sub => (
                      <button
                        key={sub}
                        onClick={() => handleSelectNavSubject(sub as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                          navSubject === sub
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {sub === 'all' ? 'All' : sub === 'math' ? '📐 Math' : '📖 R&W'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    2. Domain
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectNavDomain('all')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                        navDomain === 'all'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      All Domains
                    </button>
                    {availableDomains.map(d => (
                      <button
                        key={d}
                        onClick={() => handleSelectNavDomain(d)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border truncate text-left ${
                          navDomain === d
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {DOMAIN_NAMES[d]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    3. Skill
                  </label>
                  <select
                    value={navSkill}
                    onChange={e => handleSelectNavSkill(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50 text-neutral-900"
                  >
                    <option value="all">All Skills ({availableSkills.length})</option>
                    {availableSkills.map(sk => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                {/* Stage 4 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    4. Difficulty Tier
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['all', 'easy', 'medium', 'hard'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => handleSelectNavDifficulty(diff as any)}
                        className={`py-2 rounded-xl text-xs font-bold border uppercase tracking-wider ${
                          navDifficulty === diff
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-3 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-xs"
                >
                  Apply Filters ({filteredNavigatorSections.length} Results)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. FILTERED SECTIONS DIRECT RESULT LIST (When narrowed via Navigator) */}
        {hasActiveFilters && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Matching Skill Sections ({filteredNavigatorSections.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNavigatorSections.map(({ textbook, chapter, section }) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        textbook.subject === 'math' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {textbook.subject === 'math' ? '📐 Math' : '📖 R&W'} · {chapter.title}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        p.{section.pageNumber}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      Section {section.sectionNumber} — {section.title}
                    </h4>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {section.conceptSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400">
                      {section.workedExamples.length} Worked Examples
                    </span>
                    <button
                      onClick={() => handleOpenSectionInReader(textbook, chapter.id, section.id, section.pageNumber)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>Study Section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SUBJECT-FIRST BOUND TEXTBOOK COLLECTIONS (When browsing whole library) */}
        {!hasActiveFilters && (
          <div className="space-y-8 pt-2">
            {/* Reading & Writing Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                    <BookMarked className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900">
                    Reading & Writing Curriculum
                  </h2>
                </div>
                <span className="text-xs font-bold text-neutral-400">
                  {rwTextbooks.length} Collections
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rwTextbooks.map(book => {
                  const totalSections = book.chapters?.reduce((acc, c) => acc + (c.sections?.length || 0), 0) || 0;
                  const totalChapters = book.chapters?.length || 0;

                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1.5">
                            <span>📖</span>
                            <span>Reading & Writing</span>
                          </span>
                          <span className="text-[11px] font-bold text-neutral-400 font-mono">
                            {book.version || 'v1.0'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-neutral-500 font-medium mt-0.5">
                            {book.author}
                          </p>
                        </div>

                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                          {book.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-bold text-neutral-700">
                            {totalChapters} Domains · {totalSections} Skills
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {book.pages?.length || 40}+ Core Pages
                          </span>
                        </div>

                        {book.changelog && book.changelog[0] && (
                          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 flex items-start gap-2">
                            <History className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">
                              <strong>Updated {book.changelog[0].date}:</strong> {book.changelog[0].summary}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleSelectBook(book)}
                          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <span>Open Textbook</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Math Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900">
                    Math Curriculum & Quantitative Reasoning
                  </h2>
                </div>
                <span className="text-xs font-bold text-neutral-400">
                  {mathTextbooks.length} Collections
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mathTextbooks.map(book => {
                  const totalSections = book.chapters?.reduce((acc, c) => acc + (c.sections?.length || 0), 0) || 0;
                  const totalChapters = book.chapters?.length || 0;

                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1.5">
                            <span>📐</span>
                            <span>Math</span>
                          </span>
                          <span className="text-[11px] font-bold text-neutral-400 font-mono">
                            {book.version || 'v1.0'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-neutral-500 font-medium mt-0.5">
                            {book.author}
                          </p>
                        </div>

                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                          {book.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-bold text-neutral-700">
                            {totalChapters} Domains · {totalSections} Skills
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {book.pages?.length || 50}+ Core Pages
                          </span>
                        </div>

                        {book.changelog && book.changelog[0] && (
                          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 flex items-start gap-2">
                            <History className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">
                              <strong>Updated {book.changelog[0].date}:</strong> {book.changelog[0].summary}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleSelectBook(book)}
                          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <span>Open Textbook</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: TEXTBOOK READER & CLICKABLE BREADCRUMB
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto space-y-4 py-2">
      {/* 2.2 Clickable Breadcrumb Bar (Always visible inside reader) */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => {
              setSelectedBook(null);
              setSearchParams({});
            }}
            className="font-bold text-neutral-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Library</span>
          </button>
          <span className="text-neutral-300 font-bold">&gt;</span>

          <button
            onClick={() => {
              setSelectedBook(null);
              handleSelectNavSubject(selectedBook.subject);
            }}
            className="font-bold text-neutral-600 hover:text-blue-600 transition-colors"
          >
            {selectedBook.subject === 'math' ? 'Math' : 'Reading & Writing'}
          </button>
          <span className="text-neutral-300 font-bold">&gt;</span>

          <button
            onClick={() => {
              if (activeChapter) {
                setExpandedChapters(prev => ({ ...prev, [activeChapter.id]: true }));
              }
            }}
            className="font-bold text-neutral-600 hover:text-blue-600 transition-colors"
          >
            {activeChapter?.title || 'Chapter'}
          </button>
          <span className="text-neutral-300 font-bold">&gt;</span>

          <span className="font-extrabold text-blue-700 line-clamp-1">
            {activeSection?.title || 'Section'}
          </span>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
            <button
              onClick={() => setActiveReaderTab('lesson')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReaderTab === 'lesson'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lesson & Method
            </button>
            <button
              onClick={() => setActiveReaderTab('qa-drill')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReaderTab === 'qa-drill'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Two-Pane Q&A Drill
            </button>
            <button
              onClick={() => setActiveReaderTab('changelog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReaderTab === 'changelog'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Growth Log
            </button>
          </div>

          <button
            onClick={handleShareLink}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
            title="Share Section Deep Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reader Layout: Left Table of Contents Rail + Main Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left TOC Rail */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-4 shadow-sm space-y-3 sticky top-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-neutral-400">
              TABLE OF CONTENTS
            </span>
            <span className="text-[11px] font-bold text-blue-600">
              {selectedBook.chapters?.length || 0} Domains
            </span>
          </div>

          <div className="space-y-2">
            {selectedBook.chapters?.map(chapter => {
              const isExpanded = expandedChapters[chapter.id] ?? true;
              const isChapterActive = activeChapterId === chapter.id;

              return (
                <div key={chapter.id} className="rounded-2xl border border-neutral-100 overflow-hidden">
                  <button
                    onClick={() => toggleChapterExpand(chapter.id)}
                    className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                      isChapterActive ? 'bg-blue-50/70 text-blue-900 font-bold' : 'bg-neutral-50/80 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-[10px] font-extrabold text-neutral-700">
                        {chapter.chapterNumber}
                      </span>
                      <span className="text-xs font-bold line-clamp-1">
                        {chapter.title}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-1.5 space-y-1 bg-white">
                      {chapter.sections?.map(section => {
                        const isSectionActive = activeSectionId === section.id;

                        return (
                          <button
                            key={section.id}
                            onClick={() => handleOpenSectionInReader(selectedBook, chapter.id, section.id, section.pageNumber)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                              isSectionActive
                                ? 'bg-neutral-900 text-white font-bold shadow-xs'
                                : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] opacity-70">
                                {section.sectionNumber}
                              </span>
                              <span className="line-clamp-1">
                                {section.title}
                              </span>
                            </div>
                            <span className="text-[10px] opacity-60 font-mono">
                              p.{section.pageNumber}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: Lesson Theory & Method */}
          {activeReaderTab === 'lesson' && activeSection && (
            <div className="space-y-6">
              {/* Section Hero */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 font-mono">
                    SECTION {activeSection.sectionNumber} · {activeSection.skill}
                  </span>
                  <span className="text-xs font-bold text-neutral-400">
                    Page {activeSection.pageNumber}
                  </span>
                </div>

                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {activeSection.title}
                </h1>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-sm text-neutral-800 leading-relaxed">
                  <div className="font-bold text-blue-900 text-xs uppercase tracking-wider pb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    Concept Introduction & Theoretical Rule
                  </div>
                  <LessonContent content={activeSection.conceptSummary} />
                </div>

                {/* Core Method Steps */}
                {activeSection.methodSteps && activeSection.methodSteps.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 font-mono">
                      THE CORE SYSTEMATIC METHOD
                    </h3>
                    <div className="space-y-2">
                      {activeSection.methodSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 leading-relaxed flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="pt-0.5">
                            <LessonContent content={step} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Tier Worked Models */}
              {activeSection.workedExamples && activeSection.workedExamples.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-neutral-900">
                      Step-by-Step Worked Examples
                    </h3>
                    <span className="text-xs font-bold text-neutral-400">
                      {activeSection.workedExamples.length} Calibrated Models
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeSection.workedExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-neutral-900">
                            {ex.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            ex.difficulty === 'hard'
                              ? 'bg-red-100 text-red-800'
                              : ex.difficulty === 'medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ex.difficulty} Tier
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-sm font-medium text-neutral-900">
                          <LessonContent content={ex.problem} />
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed space-y-1">
                          <span className="font-bold block text-emerald-900 uppercase tracking-wider text-[10px]">
                            Model Solution:
                          </span>
                          <LessonContent content={ex.solution} />
                        </div>

                        {ex.trap && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                            <span className="font-bold text-amber-800 shrink-0">Common Trap:</span>
                            <span>{ex.trap}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes */}
              {activeSection.commonMistakes && activeSection.commonMistakes.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    <span>Frequently Observed Student Misconceptions</span>
                  </div>

                  <div className="space-y-2">
                    {activeSection.commonMistakes.map((mistake, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-950 flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                        <LessonContent content={mistake} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveReaderTab('qa-drill')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Practice Two-Pane Q&A Drill for this Section</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Two-Pane Q&A Drill View */}
          {activeReaderTab === 'qa-drill' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Two-Pane Q&A Interactive Workout
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Drill the exact question pattern with full method grounding and related topic bridges.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 font-mono text-xs font-bold text-neutral-700">
                  {activeSection?.skill || 'Section Drill'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Pane — Question & Similar Questions */}
                <div className="lg:col-span-6 space-y-4">
                  {featuredQuestion ? (
                    <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 font-mono">
                          FEATURED SKILL QUESTION
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          featuredQuestion.difficulty === 'expert'
                            ? 'bg-red-100 text-red-800'
                            : featuredQuestion.difficulty === 'intermediate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {featuredQuestion.difficulty}
                        </span>
                      </div>

                      <div className="text-sm font-medium text-neutral-900 leading-relaxed">
                        <LessonContent content={featuredQuestion.questionText} />
                      </div>

                      {featuredQuestion.isSPR ? (
                        <div className="space-y-2">
                          <SprInput
                            value={sprAnswer}
                            onChange={setSprAnswer}
                            disabled={isAnswerSubmitted}
                            onEnterSubmit={handleCheckDrillAnswer}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {featuredQuestion.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = idx === featuredQuestion.correctAnswer;
                            const letter = String.fromCharCode(65 + idx);

                            let btnStyle = 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800';
                            if (isAnswerSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                              } else if (isSelected && !isCorrect) {
                                btnStyle = 'border-red-500 bg-red-50 text-red-950 font-bold';
                              } else {
                                btnStyle = 'border-neutral-200 opacity-50 bg-neutral-50';
                              }
                            } else if (isSelected) {
                              btnStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-bold';
                            }

                            return (
                              <button
                                key={idx}
                                disabled={isAnswerSubmitted}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 text-xs ${btnStyle}`}
                              >
                                <span className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center font-bold shrink-0">
                                  {letter}
                                </span>
                                <span className="pt-0.5">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {!isAnswerSubmitted ? (
                        <button
                          onClick={handleCheckDrillAnswer}
                          disabled={featuredQuestion.isSPR ? !sprAnswer.trim() : selectedOption === null}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-40 transition-colors shadow-xs"
                        >
                          Check Solution
                        </button>
                      ) : (
                        <div className="text-center">
                          <button
                            onClick={() => {
                              setSelectedOption(null);
                              setSprAnswer('');
                              setIsAnswerSubmitted(false);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Reset & Try Again
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white p-8 text-center rounded-3xl border border-neutral-200 text-neutral-500 text-xs">
                      No featured question available for this skill yet.
                    </div>
                  )}

                  {similarQuestions.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-blue-600" />
                          Similar Questions Drill
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">
                          {similarQuestions.length} Questions
                        </span>
                      </div>

                      <div className="space-y-2">
                        {similarQuestions.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => handleSelectDrillQuestion(q.id)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                              activeDrillQuestionId === q.id
                                ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-950'
                                : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                            }`}
                          >
                            <span className="line-clamp-1">
                              {idx + 1}. {q.questionText.substring(0, 60)}...
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 shrink-0 ml-2">
                              {q.difficulty}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Pane — Explanation & Related Topics */}
                <div className="lg:col-span-6 space-y-4">
                  {featuredQuestion ? (
                    <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <span>In-Depth Step-by-Step Explanation</span>
                      </div>

                      <div className="text-xs leading-relaxed text-neutral-700 space-y-2">
                        <LessonContent content={featuredQuestion.explanation} />
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                        Correct Answer: Option {typeof featuredQuestion.correctAnswer === 'number' ? String.fromCharCode(65 + featuredQuestion.correctAnswer) : featuredQuestion.correctAnswer}
                      </div>
                    </div>
                  ) : null}

                  {activeSection?.relatedTopics && activeSection.relatedTopics.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-blue-600" />
                          Related Curriculum Topics
                        </span>
                        <span className="text-[11px] font-bold text-blue-600">
                          Cross-Referenced
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeSection.relatedTopics.map((rel, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const targetBook = initialTextbooks.find(b => b.id === rel.textbookId);
                              if (targetBook) {
                                handleSelectBook(targetBook);
                                if (rel.chapterId && rel.sectionId) {
                                  handleOpenSectionInReader(targetBook, rel.chapterId, rel.sectionId, rel.pageNumber || 1);
                                }
                              }
                            }}
                            className="w-full text-left p-3 rounded-xl border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between text-xs group"
                          >
                            <div>
                              <p className="font-bold text-neutral-900 group-hover:text-blue-700">
                                {rel.title}
                              </p>
                              <p className="text-[11px] text-neutral-400">
                                {rel.domain} · Page {rel.pageNumber || 1}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Growth Changelog */}
          {activeReaderTab === 'changelog' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                  <History className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Living Textbook Growth & Version Log
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    Verified curriculum additions, teacher-created exam imports, and peer-reviewed modifications.
                  </p>
                </div>
              </div>

              {selectedBook.changelog && selectedBook.changelog.length > 0 ? (
                <div className="space-y-4">
                  {selectedBook.changelog.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          {entry.date}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                          +{entry.sectionsAdded} Sections Appended
                        </span>
                      </div>

                      <p className="text-sm font-bold text-neutral-900">
                        {entry.summary}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
                        {entry.triggerExamTitle && (
                          <span>Source Exam: <strong>{entry.triggerExamTitle}</strong></span>
                        )}
                        {entry.teacherName && (
                          <span>Instructor: <strong>{entry.teacherName}</strong></span>
                        )}
                        {entry.approvedBy && (
                          <span className="text-emerald-700 font-bold">Approved by {entry.approvedBy}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No changelog entries recorded yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
