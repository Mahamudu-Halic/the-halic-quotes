'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, Sparkles, Save, Trash2, CheckCircle2, RefreshCw, 
  Map, Quote as QuoteIcon, CheckSquare, Target, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardGoal {
  id: string;
  text: string;
  x: number;
  y: number;
  checked: boolean;
}

interface BoardQuote {
  id: string;
  text: string;
  x: number;
  y: number;
}

export default function VisionBoardPage() {
  const { user } = useAuth();
  
  // Canvas State
  const [title, setTitle] = useState('My Vision Board');
  const [goals, setGoals] = useState<BoardGoal[]>([]);
  const [quotes, setQuotes] = useState<BoardQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New element inputs
  const [newGoalText, setNewGoalText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');

  // Dragging states
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'goal' | 'quote' | null>(null);

  useEffect(() => {
    if (user) {
      fetchBoardData();
    }
  }, [user]);

  const fetchBoardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/vision-board?userId=${user.id}`);
      const data = await res.json();
      if (data && !data.error) {
        setTitle(data.title);
        setGoals(data.goals || []);
        setQuotes(data.quotes || []);
      }
    } catch (e) {
      console.log('Error loading vision board', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBoard = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/vision-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title,
          goals,
          quotes,
        }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.log('Error saving vision board', e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: BoardGoal = {
      id: `goal-${Date.now()}`,
      text: newGoalText,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      checked: false,
    };

    setGoals([...goals, newGoal]);
    setNewGoalText('');
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    const newQuote: BoardQuote = {
      id: `quote-${Date.now()}`,
      text: newQuoteText,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };

    setQuotes([...quotes, newQuote]);
    setNewQuoteText('');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleRemoveQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  const handleToggleGoalCheck = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(g => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  };

  // Simple drag-and-drop emulation via mouse coordinates
  const handleDragStart = (id: string, type: 'goal' | 'quote') => {
    setActiveDragId(id);
    setDragType(type);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    const boardElement = e.currentTarget.parentElement;
    if (!boardElement) return;

    const rect = boardElement.getBoundingClientRect();
    let x = e.clientX - rect.left - 100; // Offset relative to element dimensions
    let y = e.clientY - rect.top - 40;

    // Constrain coordinates to canvas boundaries
    x = Math.max(10, Math.min(x, rect.width - 240));
    y = Math.max(10, Math.min(y, rect.height - 110));

    if (dragType === 'goal') {
      setGoals(prev => prev.map(g => (g.id === id ? { ...g, x, y } : g)));
    } else if (dragType === 'quote') {
      setQuotes(prev => prev.map(q => (q.id === id ? { ...q, x, y } : q)));
    }

    setActiveDragId(null);
    setDragType(null);
  };

  const handleClearBoard = () => {
    setGoals([]);
    setQuotes([]);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 hero-gradient">
          <div className="glass-card p-8 max-w-sm text-center">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-2 mb-4">Please toggle to a User role in the selector bottom-left to explore vision boards.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-12 px-4 max-w-7xl mx-auto w-full text-center">
        
        {/* Header toolbar */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/20 dark:bg-slate-900/10 p-6 rounded-2xl border border-white/10 mb-8 text-left">
          <div className="flex-grow">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-extrabold font-display bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-800 focus:border-purple-500 outline-none text-slate-950 dark:text-slate-50 py-0.5"
            />
            <p className="text-xs text-slate-500 mt-1">Drag and drop elements on the canvas grid below. Save changes to persist details.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClearBoard}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Clear Canvas
            </button>
            <button
              onClick={handleSaveBoard}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Board Layout'}
            </button>
          </div>
        </section>

        {/* Vision Board Grid customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Controls: Forms to add items */}
          <div className="lg:col-span-1 flex flex-col gap-6 text-left">
            
            {/* Save Success Alert */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Vision Board saved!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Goal form */}
            <div className="glass-card p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-500" />
                Add Milestone / Goal
              </h2>
              <form onSubmit={handleAddGoal} className="flex flex-col gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Become Senior Developer"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-colors hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add to Board
                </button>
              </form>
            </div>

            {/* Add Quote form */}
            <div className="glass-card p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <QuoteIcon className="w-4 h-4 text-purple-500" />
                Add Board Quote
              </h2>
              <form onSubmit={handleAddQuote} className="flex flex-col gap-2">
                <textarea
                  required
                  placeholder="e.g. Success is built one disciplined decision at a time."
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  rows={2}
                  className="bg-slate-50 dark:bg-slate-900 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500 resize-none font-sans"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-colors hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add to Board
                </button>
              </form>
            </div>

            {/* Quick helper tip */}
            <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 text-[10px] text-slate-500 leading-normal flex gap-2">
              <Compass className="w-4 h-4 text-purple-500 shrink-0 mt-0.5 animate-pulse" />
              <span>Drag cards by clicking and holding on them. Drag them to your desired position inside the grid board, then release your mouse button to drop them.</span>
            </div>

          </div>

          {/* Canvas Drag Area */}
          <div className="lg:col-span-3">
            <div className="w-full h-[520px] bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 relative bg-grid-pattern shadow-inner overflow-hidden">
              
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                  <span className="text-xs text-slate-500">Loading vision board canvas...</span>
                </div>
              ) : goals.length === 0 && quotes.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="text-xs text-slate-400">Your Vision Board is empty.</span>
                  <span className="text-[10px] text-slate-500">Add milestones or quotes from the left panel to begin.</span>
                </div>
              ) : (
                <>
                  {/* Render Goals */}
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      draggable
                      onDragStart={() => handleDragStart(g.id, 'goal')}
                      onDragEnd={(e) => handleDragEnd(e, g.id)}
                      style={{ left: g.x, top: g.y }}
                      className="absolute w-52 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/80 shadow-md cursor-grab active:cursor-grabbing hover:border-purple-500/30 group"
                    >
                      <div className="flex justify-between items-start gap-2 text-left">
                        <label className="flex gap-2 items-start text-xs font-semibold cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={g.checked}
                            onChange={() => handleToggleGoalCheck(g.id)}
                            className="mt-0.5 rounded cursor-pointer h-3.5 w-3.5 accent-purple-600" 
                          />
                          <span className={`leading-normal ${g.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{g.text}</span>
                        </label>
                        <button
                          onClick={() => handleRemoveGoal(g.id)}
                          className="text-slate-400 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Render Quotes */}
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={() => handleDragStart(q.id, 'quote')}
                      onDragEnd={(e) => handleDragEnd(e, q.id)}
                      style={{ left: q.x, top: q.y }}
                      className="absolute w-56 bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-purple-500/20 dark:border-purple-500/10 shadow-md cursor-grab active:cursor-grabbing hover:border-purple-500/40 group text-left"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs italic leading-relaxed text-slate-700 dark:text-slate-300 font-display">
                          "{q.text}"
                        </p>
                        <button
                          onClick={() => handleRemoveQuote(q.id)}
                          className="text-slate-400 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
