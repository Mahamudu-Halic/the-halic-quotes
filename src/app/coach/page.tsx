'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Send, Sparkles, AlertTriangle, ShieldCheck, Flame, 
  Copy, Download, MessageSquare, CornerDownLeft, Award, User, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/navigation';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  quote?: string;
  steps?: string[];
  createdAt: Date;
}

export default function CoachPage() {
  const { user, login } = useAuth();
  
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize coach with greeting
  useEffect(() => {
    if (user && (user.role === 'PREMIUM' || user.role === 'ADMIN') && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          sender: 'coach',
          text: `Hello ${user.name}, I am your AI Motivation Coach. I am here to listen, offer warm guidance, and give you structured steps when you feel stuck. What is on your mind today?`,
          createdAt: new Date()
        }
      ]);
    }
  }, [user, messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || loading) return;

    const userMsgText = inputText;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Package conversation history for Gemini context
      const history = messages
        .filter(m => m.id !== 'greeting')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text
        }));

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history
        }),
      });
      const data = await res.json();
      
      if (data && !data.error) {
        const coachMsg: ChatMessage = {
          id: `coach-${Date.now()}`,
          sender: 'coach',
          text: data.response,
          quote: data.quote,
          steps: data.steps,
          createdAt: new Date()
        };
        setMessages((prev) => [...prev, coachMsg]);
      } else {
        throw new Error(data.error || 'Failed response');
      }
    } catch (e) {
      console.log('Error calling coach API', e);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'coach',
          text: 'I apologize, but my connection failed momentarily. Take a deep breath and try sending your thought again.',
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateUpgrade = () => {
    login('PREMIUM');
  };

  // 1. Paywall display for Free / Guest users
  if (!user || user.role === 'FREE' || user.role === 'GUEST') {
    return (
      <>
        <Navbar />
        <main className="flex-grow hero-gradient py-16 px-4 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full glass-card p-8 text-center relative overflow-hidden flex flex-col gap-6"
          >
            {/* Top gold badge indicator */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 fill-amber-500/10 animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Premium Feature</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-50 mt-4 mb-2">
                Unlock Your Personal AI Motivation Coach
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                Struggling with burnout, interview anxiety, or procrastination? Converse with our context-aware companion to receive encouraging feedback, custom quotes, and daily action tasks.
              </p>
            </div>

            {/* Feature lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left border-y border-slate-200/50 dark:border-slate-800/40 py-5">
              <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Empathetic conversations.</span>
              </div>
              <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Actionable 3-step checklists.</span>
              </div>
              <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Custom relevant quotes.</span>
              </div>
              <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Goal alignment analysis.</span>
              </div>
            </div>

            {/* Trial CTA */}
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handleSimulateUpgrade}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-purple-500/20 cursor-pointer"
              >
                Upgrade to Premium (Simulate Free Trial)
              </button>
              <span className="text-[10px] text-slate-400">No credit card required. Upgrade immediately with a click.</span>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  // 2. Chat interface for Premium / Admin users
  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-8 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full flex-grow flex flex-col h-[70vh] bg-white/70 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xl backdrop-blur-md overflow-hidden">
          
          {/* Coach Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-bold font-display text-slate-950 dark:text-slate-50">AI Motivation Coach</h1>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Premium active
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setMessages([])} 
              className="text-[10px] text-slate-400 hover:text-purple-500 transition-colors uppercase font-bold tracking-wider"
            >
              Reset Chat
            </button>
          </div>

          {/* Chat bubbles list */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                      isUser 
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-600'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600'
                    }`}>
                      {isUser ? <User className="w-4.5 h-4.5" /> : 'AI'}
                    </div>

                    {/* Bubble Content */}
                    <div className={`flex flex-col gap-2 p-4 rounded-2xl text-xs text-left leading-relaxed ${
                      isUser
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                    }`}>
                      <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Coach specific quote attachments */}
                      {msg.quote && (
                        <div className="mt-3 p-3 bg-purple-500/5 dark:bg-purple-950/10 border border-purple-500/10 rounded-xl italic font-display font-medium text-slate-700 dark:text-slate-300 relative">
                          "{msg.quote}"
                          
                          {/* Copy shortcut */}
                          <div className="absolute top-2 right-2 flex gap-1 bg-white/80 dark:bg-slate-900/80 px-1 py-0.5 rounded border border-slate-200/50">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.quote || '');
                              }}
                              className="text-[9px] text-slate-400 hover:text-purple-600 transition-colors"
                              title="Copy quote"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Coach actionable checklist steps */}
                      {msg.steps && msg.steps.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400">Action Steps:</span>
                          <div className="flex flex-col gap-1.5">
                            {msg.steps.map((step, idx) => (
                              <label key={idx} className="flex gap-2 items-start text-xs font-sans text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 accent-purple-600 cursor-pointer rounded" />
                                <span>{step}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking Shimmer */}
            {loading && (
              <div className="flex justify-start w-full">
                <div className="flex gap-3 max-w-[80%] items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>

          {/* Form input messaging */}
          <form 
            onSubmit={handleSendMessage}
            className="flex gap-2 p-4 border-t border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/10"
          >
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Describe your current struggle (e.g. I failed my presentation, I feel lazy)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </>
  );
}
