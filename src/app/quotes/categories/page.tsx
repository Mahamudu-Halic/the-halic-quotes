'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Trophy, Shield, Briefcase, Rocket, BookOpen, Heart, Flame, Compass, 
  Activity, Star, Smile, Award, Users, GraduationCap, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: 'Success', icon: Trophy, color: 'from-amber-500 to-orange-600', description: 'Overcoming obstacles, reaching goals, and achieving your highest potential.' },
  { name: 'Leadership', icon: Shield, color: 'from-blue-500 to-indigo-600', description: 'Guiding others, inspiring trust, and making courageous decisions.' },
  { name: 'Business', icon: Briefcase, color: 'from-cyan-500 to-blue-600', description: 'Strategies, trade secrets, and frameworks for corporate excellence.' },
  { name: 'Entrepreneurship', icon: Rocket, color: 'from-purple-500 to-pink-600', description: 'Launching ventures, taking bold risks, and pioneering new paths.' },
  { name: 'Education', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', description: 'Lifelong learning, acquiring wisdom, and expansion of knowledge.' },
  { name: 'Love', icon: Heart, color: 'from-rose-500 to-red-600', description: 'Compassion, relationships, and the powerful bond that connects humanity.' },
  { name: 'Faith', icon: Compass, color: 'from-indigo-500 to-violet-600', description: 'Belief in the unseen, finding inner peace, and spiritual fortitude.' },
  { name: 'Discipline', icon: Flame, color: 'from-red-500 to-orange-600', description: 'Daily habits, emotional mastery, and consistent action toward goals.' },
  { name: 'Growth', icon: Activity, color: 'from-teal-500 to-emerald-600', description: 'Evolving, learning from failures, and personal development.' },
  { name: 'Productivity', icon: Clock, color: 'from-violet-500 to-purple-600', description: 'Optimizing systems, managing time, and executing priorities.' },
  { name: 'Confidence', icon: Award, color: 'from-yellow-500 to-amber-600', description: 'Believing in your value, standing tall, and speaking with authority.' },
  { name: 'Sports', icon: Star, color: 'from-orange-500 to-red-600', description: 'Athletic grit, competition, team collaboration, and physical drive.' },
  { name: 'Life Lessons', icon: BookOpen, color: 'from-sky-500 to-indigo-600', description: 'Timeless wisdom gained from experiences and ancient philosophies.' },
  { name: 'Relationships', icon: Users, color: 'from-pink-500 to-rose-600', description: 'Nurturing friendships, family ties, and building community bonds.' },
  { name: 'Happiness', icon: Smile, color: 'from-emerald-400 to-green-600', description: 'Joy, gratitude, finding beauty in minor things, and mental ease.' },
];

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-grow hero-gradient py-16 px-4 max-w-7xl mx-auto w-full text-center">
        
        {/* Header */}
        <section className="mb-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Explore Motivation by Category
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Browse our curated quotes library across 15 structured categories designed to fuel every aspect of your professional and personal life.
            </p>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6 flex flex-col justify-between text-left relative overflow-hidden group min-h-[200px]"
              >
                {/* Background glow gradient */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-10 rounded-bl-full transition-all duration-300`} />
                
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mt-4 mb-2">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
                  <Link 
                    href={`/?category=${cat.name}`}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:opacity-80 flex items-center gap-1"
                  >
                    <span>View quotes</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </section>

      </main>

      <Footer />
    </>
  );
}
