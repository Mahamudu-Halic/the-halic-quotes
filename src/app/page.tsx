'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Sparkles, Heart, MessageSquare, Copy, Download,
  HelpCircle, Check, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  mood: string | null;
  tags: string | null;
  isPopular: boolean;
  isTrending: boolean;
  authorBio: string | null;
  likes: any[];
  comments: any[];
}

const MOODS = [
  { emoji: '😊', name: 'Happy', moodKey: 'Happy' },
  { emoji: '😔', name: 'Sad', moodKey: 'Sad' },
  { emoji: '😰', name: 'Stressed', moodKey: 'Stressed' },
  { emoji: '🔥', name: 'Motivated', moodKey: 'Motivated' },
  { emoji: '😴', name: 'Tired', moodKey: 'Tired' },
  { emoji: '🤔', name: 'Confused', moodKey: 'Confused' },
];

export default function HomePage() {
  const { user } = useAuth();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction UI states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [explanationId, setExplanationId] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, any>>({});
  const [explainingId, setExplainingId] = useState<string | null>(null);

  // Daily Pack state
  const [dailyDigest, setDailyDigest] = useState<Record<string, Quote>>({});
  const [loadingDaily, setLoadingDaily] = useState(true);

  // Comments states
  const [activeCommentsQuoteId, setActiveCommentsQuoteId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [newCommentText, setNewCommentText] = useState('');

  // Load Quotes and Daily Digest
  useEffect(() => {
    fetchQuotes();
    fetchDailyDigest();
  }, [selectedMood, selectedCategory]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      let url = '/api/quotes?';
      if (selectedMood) url += `mood=${selectedMood}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotes(data);
      }
    } catch (e) {
      console.error('Error fetching quotes', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyDigest = async () => {
    setLoadingDaily(true);
    try {
      const res = await fetch('/api/quote/daily');
      const data = await res.json();
      if (data && !data.error) {
        setDailyDigest(data);
      }
    } catch (e) {
      console.error('Error fetching daily digest', e);
    } finally {
      setLoadingDaily(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLike = async (quoteId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/quotes/${quoteId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();

      // Update local state
      setQuotes(prevQuotes =>
        prevQuotes.map(q => {
          if (q.id === quoteId) {
            const alreadyLiked = q.likes.some(l => l.userId === user.id);
            const likes = alreadyLiked
              ? q.likes.filter(l => l.userId !== user.id)
              : [...q.likes, { quoteId, userId: user.id }];
            return { ...q, likes };
          }
          return q;
        })
      );
    } catch (e) {
      console.log('Error liking quote', e);
    }
  };

  // Explanation toggle & call
  const toggleExplanation = async (quote: Quote) => {
    if (explanationId === quote.id) {
      setExplanationId(null);
      return;
    }

    if (explanations[quote.id]) {
      setExplanationId(quote.id);
      return;
    }

    setExplainingId(quote.id);
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'explain', quote: quote.content }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setExplanations(prev => ({ ...prev, [quote.id]: data }));
        setExplanationId(quote.id);
      }
    } catch (e) {
      console.log('Error explaining quote', e);
    } finally {
      setExplainingId(null);
    }
  };

  // Comments toggling and posting
  const toggleComments = async (quoteId: string) => {
    if (activeCommentsQuoteId === quoteId) {
      setActiveCommentsQuoteId(null);
      return;
    }

    setActiveCommentsQuoteId(quoteId);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/comments`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCommentsMap(prev => ({ ...prev, [quoteId]: data }));
      }
    } catch (e) {
      console.log('Error fetching comments', e);
    }
  };

  const handlePostComment = async (e: React.FormEvent, quoteId: string) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;

    try {
      const res = await fetch(`/api/quotes/${quoteId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          content: newCommentText,
        }),
      });
      const newComment = await res.json();

      setCommentsMap(prev => ({
        ...prev,
        [quoteId]: [...(prev[quoteId] || []), newComment],
      }));

      // Update comment count on quote
      setQuotes(prevQuotes =>
        prevQuotes.map(q => {
          if (q.id === quoteId) {
            return { ...q, comments: [...q.comments, newComment] };
          }
          return q;
        })
      );

      setNewCommentText('');
    } catch (e) {
      console.log('Error posting comment', e);
    }
  };

  return (

    <main className="grow hero-gradient pb-20">

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
            Daily Motivation Ecosystem
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-6 leading-tight">
            One Quote Can <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-purple-600 via-violet-500 to-amber-500 bg-clip-text text-transparent">
              Change Your Day
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Fuel your mindset. Access curated leadership guidelines, configure custom poster layouts, and generate AI-powered thoughts tailored to your immediate mood.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex gap-2 max-w-xl mx-auto p-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-md"
        >
          <div className="relative grow flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search quotes by author, category, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-500/20"
          >
            Search
          </button>
        </motion.form>

        {/* Prompt AI generator CTA */}
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/quotes/generator"
            className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity bg-purple-500/5 px-4 py-2.5 rounded-xl border border-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            Generate custom AI Quote
          </Link>
        </div>
      </section>

      {/* Daily Quote Engine Digest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-slate-100">
              Today's Motivation Pack
            </h2>
            <p className="text-xs text-slate-500">Every morning. Curated reflection cards to start your day strong.</p>
          </div>
          <button
            onClick={fetchDailyDigest}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition-colors"
            disabled={loadingDaily}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDaily ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {['success', 'leadership', 'productivity', 'faith', 'discipline'].map((cat) => {
            const quote = dailyDigest[cat];
            const title = cat.charAt(0).toUpperCase() + cat.slice(1);
            return (
              <div
                key={cat}
                className="glass-card p-5 text-left flex flex-col justify-between hover:scale-[1.02] duration-300 relative overflow-hidden group min-h-47.5"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 dark:bg-purple-500/10 rounded-bl-full group-hover:bg-purple-500/15 transition-colors" />
                <div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest">
                    {title}
                  </span>
                  <p className="text-xs mt-3 text-slate-700 dark:text-slate-300 line-clamp-4 italic leading-relaxed">
                    "{quote?.content || 'Loading daily wisdom...'}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-slate-500 truncate max-w-25">
                    — {quote?.author || 'TheHalic'}
                  </span>
                  <button
                    onClick={() => handleCopy(quote?.content || '', cat)}
                    className="p-1 text-slate-400 hover:text-purple-500"
                  >
                    {copiedId === cat ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mood based Quotes Filter Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
            How are you feeling right now?
          </h2>
          <p className="text-xs text-slate-500">Select a mood to trigger a customized motivational stream.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedMood(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border flex items-center gap-1.5 cursor-pointer ${selectedMood === null
              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
              : 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50'
              }`}
          >
            🌟 All Feeds
          </button>
          {MOODS.map((m) => (
            <button
              key={m.moodKey}
              onClick={() => setSelectedMood(m.moodKey)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border flex items-center gap-1.5 cursor-pointer ${selectedMood === m.moodKey
                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                : 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50'
                }`}
            >
              <span>{m.emoji}</span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quotes feed list */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-bold font-display text-slate-900 dark:text-slate-100">
            {selectedMood ? `${selectedMood} Motivation Stream` : 'Curated Quotes Feed'}
          </h3>
          <span className="text-xs text-slate-500">{quotes.length} quotes found</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="text-xs text-slate-500">Refreshing feed...</span>
          </div>
        ) : quotes.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-300">No quotes match your filters</h4>
            <p className="text-xs text-slate-500 max-w-sm">Try relaxing your search terms or select another category or mood filter.</p>
            <button
              onClick={() => { setSelectedMood(null); setSelectedCategory(null); setSearchQuery(''); }}
              className="text-xs font-semibold text-purple-600 underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {quotes.map((quote) => {
              const isLiked = user && quote.likes.some(l => l.userId === user.id);
              const isExplaining = explainingId === quote.id;
              const showExplanation = explanationId === quote.id;
              const explanation = explanations[quote.id];
              const showComments = activeCommentsQuoteId === quote.id;
              const comments = commentsMap[quote.id] || [];

              return (
                <motion.div
                  key={quote.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 text-left hover:border-purple-500/30 transition-all duration-300 flex flex-col gap-4 relative"
                >
                  {/* Header: tags / category */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                        {quote.category}
                      </span>
                      {quote.mood && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-1">
                          <span>{MOODS.find(m => m.moodKey === quote.mood)?.emoji || '✨'}</span>
                          <span>{quote.mood}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Curated</span>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-lg sm:text-xl font-display font-medium text-slate-900 dark:text-slate-100 italic leading-relaxed">
                      "{quote.content}"
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <Link
                        href={`/quotes/authors/${encodeURIComponent(quote.author.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        — {quote.author}
                      </Link>
                      {quote.tags && (
                        <span className="text-[10px] text-slate-400 max-w-50 truncate">
                          Tags: {quote.tags}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Tools actions bar */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => handleLike(quote.id)}
                        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isLiked
                          ? 'text-red-500 font-bold'
                          : 'text-slate-500 hover:text-red-500'
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{quote.likes.length}</span>
                      </button>

                      {/* Comments Toggle */}
                      <button
                        onClick={() => toggleComments(quote.id)}
                        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${showComments
                          ? 'text-purple-600 dark:text-purple-400 font-bold'
                          : 'text-slate-500 hover:text-purple-600'
                          }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{quote.comments.length}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* AI Explain button */}
                      <button
                        onClick={() => toggleExplanation(quote)}
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border transition-colors ${showExplanation
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400'
                          : 'bg-white/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-purple-600'
                          }`}
                        disabled={isExplaining}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isExplaining ? 'AI Thinking...' : 'Explain meaning'}
                      </button>

                      {/* Design Wallpaper Poster shortcut */}
                      <Link
                        href={`/wallpaper-generator?quote=${encodeURIComponent(quote.content)}&author=${encodeURIComponent(quote.author)}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-purple-600 transition-colors"
                        title="Generate Wallpaper"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Link>

                      {/* Copy quote content shortcut */}
                      <button
                        onClick={() => handleCopy(quote.content, quote.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-emerald-500 transition-colors"
                        title="Copy Quote"
                      >
                        {copiedId === quote.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* AI Explanation details display */}
                  <AnimatePresence>
                    {showExplanation && explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-purple-500/5 dark:bg-purple-950/10 rounded-xl p-4 border border-purple-500/10 flex flex-col gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Deep Meaning:</span>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{explanation.meaning}</p>
                        </div>
                        <div>
                          <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Daily Application Steps:</span>
                          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed font-sans">{explanation.application}</p>
                        </div>
                        <div>
                          <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Real-Life Context:</span>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{explanation.example}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Comments block display */}
                  <AnimatePresence>
                    {showComments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden flex flex-col gap-4 border-t border-slate-200/50 dark:border-slate-800/40 pt-4"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Community Discussion</span>

                        {/* Comments List */}
                        <div className="flex flex-col gap-3 max-h-55 overflow-y-auto pr-1">
                          {comments.length === 0 ? (
                            <span className="text-xs text-slate-500 py-2">No discussions yet. Be the first to share your thoughts!</span>
                          ) : (
                            comments.map((comm: any) => (
                              <div key={comm.id} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">{comm.username}</span>
                                  <span className="text-[9px] text-slate-400">{new Date(comm.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">{comm.content}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Post new comment form */}
                        {user ? (
                          <form onSubmit={(e) => handlePostComment(e, quote.id)} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add to the reflection..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              className="grow bg-slate-50 dark:bg-slate-900/50 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500"
                            />
                            <button
                              type="submit"
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              Post
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-slate-500">Please sign in to join the discussion.</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
