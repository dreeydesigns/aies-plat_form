import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, HelpCircle, BookOpen, Loader2, MessageSquare } from 'lucide-react';
import { useAgeTier } from '../../context/AgeTierContext';

interface AiTutorPanelProps {
  lessonTitle: string;
  lessonContent: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export function AiTutorPanel({ lessonTitle, lessonContent, isOpen, onClose }: AiTutorPanelProps) {
  const { isKids, isAdult } = useAgeTier();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: isKids 
        ? `Hi there! I'm Hadithi, your friendly AI learning buddy! 🌟 Ask me anything about "${lessonTitle}"!` 
        : `Greetings! I am your AI Socratic Tutor for "${lessonTitle}". Ask me any conceptual questions, and I will help guide your understanding.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          lessonTitle,
          lessonContent,
          history: messages.slice(-6).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.answer || 'I am thinking about this concept. Let us look back at the lesson key ideas.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'tutor',
          text: `Oops! I couldn't reach the AI network: ${e.message || 'Please check your connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = isKids ? [
    'Explain this in a fun story!',
    'Why is this important?',
    'Give me a clue for the quiz!'
  ] : [
    'Explain the core mechanism step-by-step',
    'What is a real-world application of this?',
    'Give me a Socratic hint on key concepts'
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl border shadow-2xl overflow-hidden flex flex-col h-[550px] transition-all ${
      isKids ? 'border-purple-300 ring-4 ring-purple-100' : 'border-neutral-200 dark:border-neutral-800'
    }`}>
      {/* Header */}
      <div className={`p-4 flex items-center justify-between text-white ${
        isKids ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400' : 'bg-neutral-900 dark:bg-neutral-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              Hadithi AI Tutor
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            </h4>
            <p className="text-xs text-white/80">Socratic Companion · On Syllabus</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50 dark:bg-neutral-950">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              m.sender === 'user'
                ? isKids ? 'bg-purple-600 text-white rounded-br-none' : 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-bl-none shadow-xs'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className="block text-[10px] mt-1 text-right opacity-60">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-sm flex items-center gap-2 text-neutral-500 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Hadithi is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        {suggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-purple-400 whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={isKids ? 'Ask Hadithi a question...' : 'Ask AI Tutor about this lesson...'}
          className="flex-1 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className={`p-2.5 rounded-full text-white transition-colors disabled:opacity-50 ${
            isKids ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
