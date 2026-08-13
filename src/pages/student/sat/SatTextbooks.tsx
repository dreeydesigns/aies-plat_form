import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initialTextbooks } from '../../../data/textbooks';
import { Textbook, TextbookPage } from '../../../types';
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
  Sparkles
} from 'lucide-react';

export default function SatTextbooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const textbookIdParam = searchParams.get('textbookId');
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const highlightParam = searchParams.get('highlight') || '';

  const [selectedBook, setSelectedBook] = useState<Textbook | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Initialize selected book and page from query params
  useEffect(() => {
    if (textbookIdParam) {
      const book = initialTextbooks.find(b => b.id === textbookIdParam);
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

  // Filter books by search
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return initialTextbooks;
    const q = searchQuery.toLowerCase();
    return initialTextbooks.filter(
      b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // TEXTBOOK READER VIEW
  if (selectedBook) {
    const currentPage: TextbookPage | undefined = selectedBook.pages[currentPageIndex];

    return (
      <div className="max-w-5xl mx-auto space-y-6 py-2">
        {/* Top Reader Navigation Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedBook(null);
              setSearchParams({});
            }}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-500">
              Page {currentPage?.pageNumber} of {selectedBook.pages[selectedBook.pages.length - 1]?.pageNumber}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
                className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-30 hover:bg-neutral-50 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPageIndex + 1)}
                disabled={currentPageIndex === selectedBook.pages.length - 1}
                className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-30 hover:bg-neutral-50 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleShareLink}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy deep-link to this page"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Reader Layout: Sidebar TOC + Page Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Table of Contents */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4 md:col-span-1 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-neutral-500" /> Table of Contents
            </h3>
            <div className="space-y-1.5">
              {selectedBook.pages.map((p, idx) => (
                <button
                  key={p.pageNumber}
                  onClick={() => handlePageChange(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    idx === currentPageIndex
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate">{p.sections[0]?.heading || `Page ${p.pageNumber}`}</span>
                  <span className="text-[10px] text-neutral-400">p.{p.pageNumber}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Page Display */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm md:col-span-3 space-y-8 min-h-[500px]">
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

            {/* Page Main Text */}
            <div className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-base">
              <p>{currentPage?.content}</p>
            </div>

            {/* Structured Sections */}
            {currentPage?.sections && currentPage.sections.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                {currentPage.sections.map((section, idx) => (
                  <div key={idx} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 space-y-2">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      {section.heading}
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TEXTBOOK LIBRARY LIST VIEW
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Official Remediation Library
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            SAT Curated Textbooks & Guides
          </h1>
          <p className="text-neutral-500 text-sm mt-1 max-w-xl">
            Original, licensed curriculum materials integrated with our wrong-answer remediation engine.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics or titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div
                className={`w-full h-36 rounded-2xl bg-gradient-to-br ${book.coverColor} text-white p-6 flex flex-col justify-between shadow-inner`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black/20 backdrop-blur-md rounded-full">
                    AIES Original Edition
                  </span>
                  <BookOpen className="w-6 h-6 opacity-80" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">{book.author}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Publisher
                </p>
                <p className="text-xs font-medium text-neutral-600">{book.publisherOrOwner}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Available Pages & Chapters
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
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black font-bold text-white text-sm transition-colors flex items-center justify-center gap-2"
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
