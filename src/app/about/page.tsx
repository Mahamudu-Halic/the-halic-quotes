'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Sparkles, Heart, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    { icon: Sparkles, title: 'AI Guided Insights', desc: 'Synthesizing age-old philosophies with state of the art models to give you tailored perspective.' },
    { icon: Shield, title: 'Discipline Over Motivation', desc: 'Focusing on actionable systems, daily tracking streaks, and milestones rather than fleeting emotion.' },
    { icon: Heart, title: 'Compassionate Advice', desc: 'Providing empathetic validation through our premium Motivation Coach for tough and stressed days.' },
    { icon: Rocket, title: 'Vision Realization', desc: 'Consolidating goals, milestones, and quotes into interactive visual layouts to trigger consistent execution.' }
  ];

  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-16 px-4">
        <div className="max-w-4xl mx-auto text-left">
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Our Vision & Mission
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              TheHalicQuotes was born from a simple realization: motivation is just a spark, but systems, discipline, and support are the engines of success.
            </p>
          </motion.div>

          {/* Vision card */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mb-3">
              Beyond Curating Random Words
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Traditional quote portals dump thousands of random, unorganized phrases in front of users, leaving them with fleeting motivation that evaporates in minutes. We believe quotes are most powerful when contextualized. By integrating AI-powered explanations, direct application checklists, mood selectors, and visual vision boards, we transform reading quotes into an active self-improvement practice.
            </p>
          </div>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 flex flex-col gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/15">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
