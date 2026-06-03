'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Flame, Award, FolderPlus, Folder, Trash2, Heart, Copy, 
  Sparkles, CheckCircle2, RefreshCw, Star, Settings, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  quotes: string[];
}

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
}

interface UserProgress {
  streakCount: number;
  unlockedBadges: string[];
  interests: string[];
}

const AVAILABLE_INTERESTS = [
  'Success', 'Leadership', 'Business', 'Entrepreneurship', 'Education',
  'Faith', 'Discipline', 'Growth', 'Productivity', 'Confidence', 'Happiness'
];

export default function DashboardPage() {
  const { user, updateInterests } = useAuth();
  
  // Dashboard states
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Actions states
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'collections' | 'saved' | 'interests'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savingInterests, setSavingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch user progress (streak, badges)
      const resProgress = await fetch(`/api/user/progress?userId=${user.id}`);
      const dataProgress = await resProgress.json();
      if (dataProgress && !dataProgress.error) {
        setProgress(dataProgress);
        setSelectedInterests(dataProgress.interests || []);
      }

      // 2. Fetch user collections
      const resColl = await fetch(`/api/user/collections?userId=${user.id}`);
      const dataColl = await resColl.json();
      if (Array.isArray(dataColl)) {
        setCollections(dataColl);
      }

      // 3. Fetch user liked quotes
      const resQuotes = await fetch(`/api/quotes?userId=${user.id}`);
      const dataQuotes = await resQuotes.json();
      if (Array.isArray(dataQuotes)) {
        // Filter out quotes that are liked by this user
        const liked = dataQuotes.filter((q: any) => 
          q.likes && q.likes.some((l: any) => l.userId === user.id)
        );
        setSavedQuotes(liked);
      }
    } catch (e) {
      console.log('Error fetching dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !user) return;

    try {
      const res = await fetch('/api/user/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName, userId: user.id }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setCollections([data, ...collections]);
        setNewCollectionName('');
        setShowAddCollection(false);
      }
    } catch (e) {
      console.log('Error creating collection', e);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/user/collections?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCollections(collections.filter(c => c.id !== id));
      }
    } catch (e) {
      console.log('Error deleting collection', e);
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSaveInterests = async () => {
    if (!user) return;
    setSavingInterests(true);
    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'update_interests',
          interests: selectedInterests,
        }),
      });
      const data = await res.json();
      if (data && !data.error) {
        updateInterests(selectedInterests);
        if (progress) {
          setProgress({ ...progress, interests: selectedInterests });
        }
      }
    } catch (e) {
      console.log('Error updating interests', e);
    } finally {
      setSavingInterests(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const badges = [
    { name: 'Day 1 Activator', desc: 'Unlocked upon first visiting the quotes space.', icon: Star, color: 'text-purple-500 bg-purple-500/10' },
    { name: '7 Day Streak', desc: 'Unlocked after visiting 7 consecutive days.', icon: Flame, color: 'text-amber-500 bg-amber-500/10' },
    { name: '30 Day Streak', desc: 'Unlocked after visiting 30 consecutive days.', icon: Award, color: 'text-blue-500 bg-blue-500/10' },
  ];

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 hero-gradient">
          <div className="glass-card p-8 max-w-sm text-center">
            <UserIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-2 mb-4">Please toggle to a User role in the selector bottom-left to explore the dashboard.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
          
          {/* Header block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/20 dark:bg-slate-900/10 p-6 rounded-2xl border border-white/10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1">Manage your personalized motivation parameters.</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={fetchDashboardData}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                href="/quotes/generator"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Quote Builder
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          {progress && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <Flame className="w-6 h-6 fill-amber-500" />
                </div>
                <div>
                  <span className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 block">
                    {progress.streakCount} Days
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Current Streak
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 block">
                    {progress.unlockedBadges.length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Achievements
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Folder className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 block">
                    {collections.length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Quote Collections
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Core tabs navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {(['overview', 'collections', 'saved', 'interests'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Panes */}
          <div className="min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                <span className="text-xs text-slate-500">Loading data profiles...</span>
              </div>
            ) : (
              <div>
                
                {/* 1. Overview tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Badge achievement panel */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                      <h2 className="text-base font-bold font-display text-slate-950 dark:text-slate-100">Badge Achievements</h2>
                      <div className="flex flex-col gap-3">
                        {badges.map((badge) => {
                          const isUnlocked = progress?.unlockedBadges.includes(badge.name);
                          return (
                            <div 
                              key={badge.name}
                              className={`p-4 rounded-2xl border flex items-start gap-4 transition-all ${
                                isUnlocked 
                                  ? 'bg-white/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 opacity-100'
                                  : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200/20 dark:border-slate-800/20 opacity-50'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.color} shrink-0`}>
                                <badge.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-grow text-left">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{badge.name}</span>
                                  {isUnlocked ? (
                                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Unlocked</span>
                                  ) : (
                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-semibold uppercase">Locked</span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{badge.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interest panel shortcut */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                      <h2 className="text-base font-bold font-display text-slate-950 dark:text-slate-100">My Categories</h2>
                      <div className="glass-card p-5 flex flex-col gap-4">
                        <p className="text-xs text-slate-500">Your feeds adjust automatically based on these interests.</p>
                        <div className="flex flex-wrap gap-1.5">
                          {progress?.interests.map((interest) => (
                            <span 
                              key={interest} 
                              className="bg-purple-500/10 border border-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => setActiveTab('interests')}
                          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Modify preferences
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. Collections tab */}
                {activeTab === 'collections' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-base font-bold font-display text-slate-950 dark:text-slate-100">My Quote folders</h2>
                      <button
                        onClick={() => setShowAddCollection(!showAddCollection)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FolderPlus className="w-4 h-4" />
                        New Folder
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAddCollection && (
                        <motion.form 
                          onSubmit={handleCreateCollection}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-2 max-w-sm p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                          <input
                            type="text"
                            required
                            placeholder="Collection Name (e.g. Daily Business)"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            className="flex-grow bg-white dark:bg-slate-950 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 outline-none"
                          />
                          <button
                            type="submit"
                            className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            Create
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {collections.length === 0 ? (
                      <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                        <Folder className="w-8 h-8 text-slate-400" />
                        <h4 className="font-semibold text-slate-800 dark:text-slate-300">No quote folders yet</h4>
                        <p className="text-xs text-slate-500">Create collections to group and organize quote cards that speak to you.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {collections.map((c) => (
                          <div 
                            key={c.id} 
                            className="glass-card p-5 text-left flex justify-between items-center hover:scale-[1.01] transition-transform duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Folder className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{c.name}</span>
                                <span className="text-[10px] text-slate-500">{(c.quotes || []).length} items saved</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteCollection(c.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Saved tab */}
                {activeTab === 'saved' && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-base font-bold font-display text-slate-950 dark:text-slate-100">Liked Wisdom Cards</h2>
                    
                    {savedQuotes.length === 0 ? (
                      <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                        <Heart className="w-8 h-8 text-slate-400" />
                        <h4 className="font-semibold text-slate-800 dark:text-slate-300">No saved quotes</h4>
                        <p className="text-xs text-slate-500">Like quote cards on the homepage to access them here instantly.</p>
                        <Link href="/" className="text-xs font-semibold text-purple-600 underline">Explore Quotes Feed</Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {savedQuotes.map((quote) => (
                          <div 
                            key={quote.id} 
                            className="glass-card p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                          >
                            <div>
                              <p className="text-sm font-medium font-display italic text-slate-900 dark:text-slate-100">"{quote.content}"</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">— {quote.author} ({quote.category})</span>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => handleCopy(quote.content, quote.id)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors"
                              >
                                {copiedId === quote.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Interests Onboarding tab */}
                {activeTab === 'interests' && (
                  <div className="glass-card p-6 flex flex-col gap-6">
                    <div>
                      <h2 className="text-base font-bold font-display text-slate-950 dark:text-slate-100">Motivational Focus Areas</h2>
                      <p className="text-xs text-slate-500 mt-1">Select topics that fit your current focus. Your dashboard recommendations and daily alerts will sync dynamically.</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {AVAILABLE_INTERESTS.map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => handleToggleInterest(interest)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                              active
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/10'
                                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleSaveInterests}
                      className="w-fit bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-500/10 self-start"
                      disabled={savingInterests}
                    >
                      {savingInterests ? 'Syncing...' : 'Save Interests'}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
