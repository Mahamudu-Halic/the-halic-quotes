'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const POSTS = [
  {
    title: 'The Science of Motivation: Breaking the Procrastination Cycle',
    excerpt: 'Understand how dopamine pathways regulate our drive, and learn how to lower the bar of starting to bypass mental paralysis.',
    date: 'June 1, 2026',
    readTime: '5 min read',
    category: 'Science'
  },
  {
    title: 'Stoic Discipline: Timeless Reflections from Marcus Aurelius',
    excerpt: 'Deep dive into Meditations, focusing on how separating external events from internal reactions builds unwavering mental toughness.',
    date: 'May 28, 2026',
    readTime: '7 min read',
    category: 'Philosophy'
  },
  {
    title: 'Creating a Vision Board That Actually Triggers Action',
    excerpt: 'Vision boards fail when they represent passive daydreaming. Learn how to pair goals with immediate micro-milestones.',
    date: 'May 15, 2026',
    readTime: '4 min read',
    category: 'Guides'
  }
];

export default function BlogPage() {
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
              The Motivation Blog
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Actionable guides, philosophy breakdowns, and science-backed systems to optimize your life.
            </p>
          </motion.div>

          <div className="flex flex-col gap-6">
            {POSTS.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:border-purple-500/20 duration-300"
              >
                <div className="flex-grow flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                      <span>{post.category}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50 mb-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 group w-fit cursor-pointer hover:underline mt-4">
                    Read article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
