'use client';

// import React, { useState } from 'react';
import Link from 'next/link';
// import { Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  // const [email, setEmail] = useState('');
  // const [subscribed, setSubscribed] = useState(false);
  // const [listType, setListType] = useState('daily');

  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email) return;
  //   setSubscribed(true);
  //   setEmail('');
  //   setTimeout(() => setSubscribed(false), 5000);
  // };

  return (
    <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & Pitch */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md">
                Q
              </span>
              <span className="text-lg font-bold font-display tracking-tight bg-linear-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                TheHalicQuotes
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Your daily motivation and productivity companion. We help you stay disciplined, focused, and inspired to manifest your biggest dreams.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase mb-4">Discover</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/quotes/categories" className="hover:text-purple-600 transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/quotes/generator" className="hover:text-purple-600 transition-colors">AI Quote Generator</Link>
              </li>
              <li>
                <Link href="/wallpaper-generator" className="hover:text-purple-600 transition-colors">Poster & Wallpaper Customizer</Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-purple-600 transition-colors">AI Coaching Space</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-600 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-600 transition-colors">Motivation Blog</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Terms & Privacy</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          {/* <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Join The Newsletter</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Subscribe to daily wisdom and actionable guides straight to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Subscription successful! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <select
                    value={listType}
                    onChange={(e) => setListType(e.target.value)}
                    className="bg-white dark:bg-slate-950 text-xs px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                  >
                    <option value="daily">Daily Motivation</option>
                    <option value="weekly">Weekly Success</option>
                    <option value="leadership">Leadership Insights</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div> */}

        </div>

        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TheHalicQuotes. Built to fuel your mindset. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
