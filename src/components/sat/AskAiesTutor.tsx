import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Loader2,
  ChevronRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ChatMessage {
  id: string;
  sender: 'student' | 'aies';
  text: string;
  suggestedSections?: Array<{
    title: string;
    textbookId: string;
    chapterId: string;
    sectionId: string;
  }>;
  timestamp: string;
}

export default function AskAiesTutor({ currentSectionTitle }: { currentSectionTitle?: string }) {
  const { userProfile } = useAppContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'aies',
      text: "Hi! I'm AIES, your Socratic SAT Tutor. If you're stuck on a tricky concept, wondering why an answer choice is wrong, or want a simpler explanation for anything in the textbooks, just ask me below!",
      suggestedSections: [
        {
          title: 'Foundations of Algebra · Linear Equations',
          textbookId: 'sat-foundations-math',
          chapterId: 'ch1',
          sectionId: 'sec-1-1'
        },
        {
          title: 'Craft & Structure · Context Clues & Tone',
          textbookId: 'sat-reading-writing-mastery',
          chapterId: 'ch-rw-1',
          sectionId: 'sec-rw-1-1'
        }
      ],
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'student',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    try {
      if (userProfile?.id) {
        try {
          await addDoc(collection(db, 'studentUnderstandingLogs'), {
            studentId: userProfile.id,
            studentName: userProfile.name || 'Student',
            query: textToSend.trim(),
            currentContext: currentSectionTitle || 'Textbook Library',
            timestamp: new Date().toISOString(),
            institutionId: userProfile.institutionId || null
          });
        } catch (e) {
          // ignore offline log
        }
      }

      let aiResponseText = '';
      let suggested: any[] = [];

      try {
        const res = await fetch('/api/gemini/grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'You are AIES, an encouraging, deeply empathetic, world-class Socratic SAT tutor. The student asked: ' + JSON.stringify(textToSend.trim()) + '. Context: ' + JSON.stringify(currentSectionTitle || 'Textbook Library') + '. Provide a conversational, crystal-clear explanation. Do not sound robotic. If they seem confused, use a relatable real-world analogy. Keep it structured and encouraging (under 160 words).'
          })
        });

        if (res.ok) {
          const data = await res.json();
          aiResponseText = data.result || '';
        }
      } catch (err) {
        console.warn('AI endpoint fallback', err);
      }

      if (!aiResponseText) {
        const lower = textToSend.toLowerCase();
        if (lower.includes('comma') || lower.includes('punctuation') || lower.includes('splice') || lower.includes('boundary')) {
          aiResponseText = "Think of independent clauses like two complete trains. You can't just glue them together with a weak comma—that's a comma splice! To link them, you need either a period, a semicolon (;), or a comma followed by a FANBOYS conjunction (for, and, nor, but, or, yet, so). Let's look at Chapter 1 in the Grammar manual!";
          suggested = [{
            title: 'Grammar & Conventions · Sentence Boundaries',
            textbookId: 'sat-grammar-conventions',
            chapterId: 'ch-gram-1',
            sectionId: 'sec-gram-1-1'
          }];
        } else if (lower.includes('slope') || lower.includes('linear') || lower.includes('equation') || lower.includes('graph')) {
          aiResponseText = "Great question! Slope (m) is simply the 'rate of change'—how much y changes for every 1 step to the right on x. If two lines are parallel, their slopes are identical. If they are perpendicular, their slopes are negative reciprocals (like 2/3 and -3/2)!";
          suggested = [{
            title: 'Foundations of Math · Linear Systems & Graphs',
            textbookId: 'sat-foundations-math',
            chapterId: 'ch1',
            sectionId: 'sec-1-1'
          }];
        } else {
          aiResponseText = "I hear you! That's one of the most common puzzle areas on the Digital SAT. The key strategy here is to break down the question stem into its core components before looking at the answer choices. Let's explore the step-by-step textbook models!";
          suggested = [{
            title: 'Foundations of SAT Math · Core Methodologies',
            textbookId: 'sat-foundations-math',
            chapterId: 'ch1',
            sectionId: 'sec-1-1'
          }];
        }
      }

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'aies',
        text: aiResponseText,
        suggestedSections: suggested.length > 0 ? suggested : undefined,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'aies',
        text: 'I had trouble connecting for a moment, but keep that thought! Try rephrasing your question or selecting one of the topic guides below.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 rounded-3xl border border-indigo-500/30 p-5 sm:p-6 shadow-2xl text-white space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">Ask AIES — Socratic SAT Tutor</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Live AI
              </span>
            </div>
            <p className="text-xs text-indigo-200/70">
              Conversational concept explanations, textbook navigation & Socratic problem breakdowns
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Reset conversation"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin scrollbar-thumb-indigo-900">
        {messages.map((msg) => {
          const isUser = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={'flex gap-3 ' + (isUser ? 'justify-end' : 'justify-start')}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={'max-w-md sm:max-w-lg rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ' +
                  (isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none space-y-2.5')}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.suggestedSections && msg.suggestedSections.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Jump to Curriculum Section</span>
                    </p>
                    {msg.suggestedSections.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate('/student/sat/textbooks?textbookId=' + sec.textbookId + '&chapter=' + sec.chapterId + '&section=' + sec.sectionId)}
                        className="w-full text-left p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-950/80 border border-slate-700 hover:border-indigo-500/50 text-[11px] font-semibold text-indigo-200 transition-all flex items-center justify-between"
                      >
                        <span>{sec.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-blue-600/40 border border-blue-500/30 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-xl bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-800/90 rounded-2xl px-4 py-2.5 text-xs text-indigo-300 border border-slate-700/80 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AIES is analyzing SAT concept & formulating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          onClick={() => handleSend("Explain comma splices and semicolons like I'm new to this")}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
        >
          💡 Explain Comma Splices
        </button>
        <button
          onClick={() => handleSend("How do I quickly identify if a system of equations has no solution?")}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
        >
          📐 Systems with No Solution
        </button>
        <button
          onClick={() => handleSend("I still don't get why answer B was wrong on my practice problem")}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
        >
          🤔 "I still don't understand"
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything (e.g. 'Why is D wrong on question 4?', 'Explain transition words')..."
          className="flex-1 px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition-all shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}