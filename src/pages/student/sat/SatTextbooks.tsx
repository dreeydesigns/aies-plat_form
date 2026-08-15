import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initialTextbooks } from '../../../data/textbooks';
import { initialSatQuestions } from '../../../data/sat-questions';
import { Textbook, TextbookPage, SatQuestion } from '../../../types';
import { LessonContent } from '../../../components/shared/LessonContent';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
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
  ArrowRight
} from 'lucide-react';

export const normalizeTextbookId = (id: string | null | undefined): string => {
  if (!id) return '';
  if (id === 'sat-math-foundations' || id === 'sat-foundations-math') return 'sat-foundations-math';
  if (id === 'sat-rw-mastery' || id === 'sat-reading-writing-mastery') return 'sat-reading-writing-mastery';
  if (id === 'sat-adv-math' || id === 'sat-advanced-math-mastery') return 'sat-advanced-math-mastery';
  if (id === 'sat-grammar' || id === 'sat-grammar-conventions') return 'sat-grammar-conventions';
  return id;
};

export default function SatTextbooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const textbookIdParam = searchParams.get('textbookId') || searchParams.get('book');
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const highlightParam = searchParams.get('highlight') || '';

  const [selectedBook, setSelectedBook] = useState<Textbook | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'questions' | 'ai'>('reading');

  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Initialize selected book and page from query params
  useEffect(() => {
    if (textbookIdParam) {
      const normId = normalizeTextbookId(textbookIdParam);
      const book = initialTextbooks.find(b => b.id === normId || b.id === textbookIdParam);
      if (book) {
        setSelectedBook(book);
        if (pageParam > 0) {
          const pageIdx = book.pages.findIndex(p => p.pageNumber === pageParam);
          if (pageIdx !== -1) {
            setCurrentPageIndex(pageIdx);
          }
        }
      }
    }
  }, [textbookIdParam, pageParam]);

  // Scroll to highlight if present
  useEffect(() => {
    if (highlightParam && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightParam, currentPageIndex, selectedBook]);

  const handleSelectBook = (book: Textbook) => {
    setSelectedBook(book);
    setCurrentPageIndex(0);
    setSearchParams({ textbookId: book.id, page: book.pages[0]?.pageNumber.toString() || '1' });
  };

  const handlePageChange = (newIdx: number) => {
    if (!selectedBook) return;
    if (newIdx >= 0 && newIdx < selectedBook.pages.length) {
      setCurrentPageIndex(newIdx);
      const pageNum = selectedBook.pages[newIdx].pageNumber;
      setSearchParams({ textbookId: selectedBook.id, page: pageNum.toString() });
    }
  };

  const handleShareLink = () => {
    if (!selectedBook) return;
    const pageNum = selectedBook.pages[currentPageIndex]?.pageNumber || 1;
    const url = `${window.location.origin}/student/sat/textbooks?textbookId=${selectedBook.id}&page=${pageNum}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Questions referenced by this book/page
  const relatedQuestions = useMemo(() => {
    if (!selectedBook) return [];
    const currentPage = selectedBook.pages[currentPageIndex];
    if (!currentPage) return [];
    const normBookId = normalizeTextbookId(selectedBook.id);
    return initialSatQuestions.filter(q => {
      const qNormId = normalizeTextbookId(q.textbookRef?.textbookId);
      return (
        (qNormId === normBookId || q.textbookRef?.textbookId === selectedBook.id) &&
        (q.textbookRef?.page === currentPage.pageNumber || !q.textbookRef?.page)
      );
    });
  }, [selectedBook, currentPageIndex]);

  // Filter books by search
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return initialTextbooks;
    const q = searchQuery.toLowerCase();
    return initialTextbooks.filter(
      b => b.title.toLowerCase().includes(q) || 
           b.author.toLowerCase().includes(q) ||
           b.pages.some(p => 
             p.content.toLowerCase().includes(q) || 
             (p.ocrText && p.ocrText.toLowerCase().includes(q)) ||
             p.sections.some(s => s.heading.toLowerCase().includes(q) || s.text.toLowerCase().includes(q))
           )
    );
  }, [searchQuery]);

  // TEXTBOOK READER VIEW
  if (selectedBook) {
    const currentPage: TextbookPage | undefined = selectedBook.pages[currentPageIndex];

    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBook(null)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Textbook Library
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Page</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reader Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Table of Contents / Sidebar */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4 md:col-span-1 h-fit">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-neutral-900 text-sm">Table of Contents</h3>
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {selectedBook.pages.map((p, idx) => (
                <button
                  key={p.pageNumber}
                  onClick={() => handlePageChange(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    currentPageIndex === idx
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200 shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate">{p.sections[0]?.heading || `Page ${p.pageNumber}`}</span>
                  <span className="text-[10px] text-neutral-400">p.{p.pageNumber}</span>
                </button>
              ))}
            </div>

            {/* Quick Practice Launcher */}
            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => navigate('/student/sat/practice')}
                className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Practice This Subject
              </button>
            </div>
          </div>

          {/* Page Display & Content */}
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-neutral-200 shadow-sm md:col-span-3 space-y-8 min-h-[500px]">
            {/* Header info */}
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedBook.title}
                </p>
                <h1 className="text-2xl font-bold text-neutral-900 mt-1">
                  {currentPage?.sections[0]?.heading || `Page ${currentPage?.pageNumber}`}
                </h1>
              </div>
              <span className="text-sm font-bold text-neutral-400">
                Pg. {currentPage?.pageNumber}
              </span>
            </div>

            {/* Highlight Alert if navigating from wrong answer remediation */}
            {highlightParam && (
              <div
                ref={highlightRef}
                className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 space-y-1.5 animate-in fade-in"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800">
                  <Highlighter className="w-4 h-4 text-amber-600" />
                  Target Remediation Passage
                </div>
                <p className="text-sm font-medium italic">
                  "{decodeURIComponent(highlightParam)}"
                </p>
              </div>
            )}

            {/* Mode Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
              <button
                onClick={() => setActiveTab('reading')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'reading' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Textbook Chapter
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'questions' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>Linked Questions</span>
                <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded-full text-[10px]">
                  {relatedQuestions.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Key Takeaways
              </button>
            </div>

            {/* Tab: Reading */}
            {activeTab === 'reading' && (
              <div className="space-y-6">
                <div className="max-w-none text-neutral-800 leading-relaxed text-sm">
                  <LessonContent content={currentPage?.content || ''} />
                </div>

                {/* Structured Sections */}
                {currentPage?.sections && currentPage.sections.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    {currentPage.sections.map((section, idx) => (
                      <div key={idx} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 space-y-3">
                        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          {section.heading}
                        </h3>
                        <div className="text-sm text-neutral-700 leading-relaxed">
                          <LessonContent content={section.text} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Linked Questions */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-800">
                    Official SAT Drill Items Grounded in Page {currentPage?.pageNumber}
                  </h3>
                  <span className="text-xs text-neutral-500">{relatedQuestions.length} questions available</span>
                </div>

                {relatedQuestions.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                    No individual questions mapped directly to this specific page index yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Item ID: {q.id}
                          </span>
                          <span className="text-xs font-extrabold uppercase text-neutral-500">
                            {q.difficulty}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-900 font-medium leading-relaxed">
                          <LessonContent content={q.questionText} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {q.options?.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                                optIdx === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : 'bg-white border-neutral-200 text-neutral-700'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {optIdx === q.correctAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                            <span className="font-bold">Official Rationale: </span>
                            <LessonContent content={q.explanation} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: AI Key Takeaways */}
            {activeTab === 'ai' && (
              <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Synthesis & SAT Strategy Guide for Page {currentPage?.pageNumber}
                </div>
                <div className="space-y-3 text-xs text-neutral-800 leading-relaxed">
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs space-y-1">
                    <span className="font-bold text-blue-800">1. Core SAT Tested Concept</span>
                    <p>Identify the central claim of the passage by determining what overarching idea connects every supporting sentence, rather than focusing on an isolated detail.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs space-y-1">
                    <span className="font-bold text-amber-800">2. High-Frequency Trap Types</span>
                    <p>Watch for choices that are factually accurate to the excerpt but "Too Narrow" (only stating one sentence's detail) or "Too Extreme" (introducing unsupported absolutes).</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs space-y-1">
                    <span className="font-bold text-emerald-800">3. Rapid Elimination Method</span>
                    <p>If a question asks "What is true according to the text?", eliminate any option where the relationship between causes or characters has been subtly reversed.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TEXTBOOK LIBRARY LIST VIEW
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            AI Remediation & Textbook Library
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Curated SAT Textbooks & Skill Manuals
          </h1>
          <p className="text-neutral-500 text-sm mt-1 max-w-xl">
            Original curriculum materials with full OCR indexing, case studies, and 1-click deep-link wrong answer remediation.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics, authors, or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div
                className={`w-full h-40 rounded-2xl bg-gradient-to-br ${book.coverColor} text-white p-6 flex flex-col justify-between shadow-inner`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black/20 backdrop-blur-md rounded-full">
                    AIES Edition
                  </span>
                  <BookOpen className="w-5 h-5 opacity-90" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">{book.author}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Publisher
                </p>
                <p className="text-xs font-semibold text-neutral-700">{book.publisherOrOwner}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Indexed Chapters & Pages
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {book.pages.map((p) => (
                    <span
                      key={p.pageNumber}
                      className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-semibold"
                    >
                      Pg. {p.pageNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectBook(book)}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white text-xs transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Open Textbook Reader
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
