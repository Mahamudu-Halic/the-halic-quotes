'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, Copy, Download, Heart, RefreshCw, CheckCircle2, 
  MessageSquare, Compass, Eye, Share2, Layers, Repeat 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const TOPICS = [
  'Success', 'Leadership', 'Business', 'Entrepreneurship', 'Education',
  'Love', 'Faith', 'Discipline', 'Growth', 'Productivity', 'Confidence',
  'Sports', 'Life Lessons', 'Relationships', 'Happiness'
];

const MOODS = ['Motivated', 'Stressed', 'Happy', 'Sad', 'Tired', 'Confused'];

const REWRITE_STYLES = ['Inspirational', 'Professional', 'Funny', 'Gen-Z', 'Business'];

export default function QuoteGeneratorPage() {
  const { user } = useAuth();
  
  // Input parameters
  const [topic, setTopic] = useState(TOPICS[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [goal, setGoal] = useState('Build a successful company');
  const [audience, setAudience] = useState('My team members');

  // Generator result state
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Rewriter state
  const [selectedStyle, setSelectedStyle] = useState(REWRITE_STYLES[1]);
  const [rewrittenText, setRewrittenText] = useState('');
  const [rewriting, setRewriting] = useState(false);
  const [copiedRewritten, setCopiedRewritten] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedQuote(null);
    setRewrittenText('');
    setSaved(false);

    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          topic,
          mood,
          goal,
          audience,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (data && data.quote) {
        setGeneratedQuote(data.quote);
      }
    } catch (e) {
      console.log('Error generating quote', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!generatedQuote) return;
    setRewriting(true);
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rewrite',
          quote: generatedQuote.content,
          style: selectedStyle,
        }),
      });
      const data = await res.json();
      if (data && data.rewritten) {
        setRewrittenText(data.rewritten);
      }
    } catch (e) {
      console.log('Error rewriting quote', e);
    } finally {
      setRewriting(false);
    }
  };

  const handleCopy = (text: string, isRewrite = false) => {
    navigator.clipboard.writeText(text);
    if (isRewrite) {
      setCopiedRewritten(true);
      setTimeout(() => setCopiedRewritten(false), 2500);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = async () => {
    if (!generatedQuote || !user) return;
    try {
      await fetch(`/api/quotes/${generatedQuote.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      setSaved(true);
    } catch (e) {
      console.log('Error saving quote', e);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-12 px-4 max-w-7xl mx-auto w-full text-center">
        
        {/* Title */}
        <section className="mb-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-3">
              AI Quote Generator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Provide context metrics to let Gemini build a customized motivational card. Stylize results using the AI Rewriter.
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          
          {/* Inputs Column */}
          <div className="lg:col-span-1 glass-card p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-500" />
              Generator Metrics
            </h2>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-semibold uppercase">Inspiration Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500"
                >
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-semibold uppercase">Current Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500"
                >
                  {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-semibold uppercase">Target Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preparing for exam, business growth"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-semibold uppercase">Target Audience</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My employees, self-talk"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Synthesizing quote...' : 'Generate Quote'}
              </button>
            </form>
          </div>

          {/* Output Card Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Card Result Display */}
            <div className="glass-card p-8 min-h-[220px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 dark:from-purple-950/10 dark:to-indigo-950/10">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
              
              {loading ? (
                <div className="flex-grow flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                  <span className="text-xs text-slate-500">Gemini is writing daily wisdom for you...</span>
                </div>
              ) : generatedQuote ? (
                <div className="flex flex-col gap-6 justify-between h-full">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                      AI GENERATION ({generatedQuote.category})
                    </span>
                    <p className="text-xl sm:text-2xl font-display font-medium text-slate-900 dark:text-slate-50 italic leading-relaxed">
                      "{generatedQuote.content}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-200/50 dark:border-slate-800/40 gap-4">
                    <span className="text-xs text-slate-500">
                      Goal: {goal} | Audience: {audience}
                    </span>

                    <div className="flex gap-2">
                      {/* Save locally */}
                      {user && (
                        <button
                          onClick={handleLike}
                          disabled={saved}
                          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            saved 
                              ? 'bg-red-500/10 border-red-500/20 text-red-500 font-bold' 
                              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{saved ? 'Saved!' : 'Save Quote'}</span>
                        </button>
                      )}

                      {/* Design wallpaper */}
                      <Link
                        href={`/wallpaper-generator?quote=${encodeURIComponent(generatedQuote.content)}&author=AI%20Generator`}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:text-purple-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Wallpaper
                      </Link>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(generatedQuote.content)}
                        className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
                  <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-400">Configure parameters on the left and click generate.</span>
                </div>
              )}
            </div>

            {/* Rewriter Segment */}
            {generatedQuote && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 flex flex-col gap-4 text-left"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-purple-500 animate-spin" style={{ animationDuration: '6s' }} />
                    AI Style Rewriter
                  </h3>
                  <p className="text-[10px] text-slate-500">Transform the generated quote into a different tone instantly.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {REWRITE_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-colors ${
                        selectedStyle === style
                          ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                          : 'border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleRewrite}
                    disabled={rewriting}
                    className="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {rewriting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Repeat className="w-3 h-3" />}
                    Rewrite
                  </button>
                </div>

                {/* Rewriter Result */}
                <AnimatePresence>
                  {rewrittenText && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center gap-4 overflow-hidden mt-2"
                    >
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                        "{rewrittenText}"
                      </p>
                      <button
                        onClick={() => handleCopy(rewrittenText, true)}
                        className="p-1.5 bg-white dark:bg-slate-950 rounded-lg text-slate-500 hover:text-emerald-500 border border-slate-200/50 dark:border-slate-800/50"
                      >
                        {copiedRewritten ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
