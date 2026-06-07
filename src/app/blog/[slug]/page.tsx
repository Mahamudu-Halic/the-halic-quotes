'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, Clock, User, Share2, Copy,
  Download, Sparkles, BookOpen, Check, CheckCircle2,
  AlertCircle, ChevronRight, Mail
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { POSTS } from '@/lib/blog';

// Related quotes mapping for each blog post
const RELATED_QUOTES: Record<string, { content: string; author: string }> = {
  'the-science-of-motivation-breaking-the-procrastination-cycle': {
    content: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  'stoic-discipline-timeless-reflections-from-marcus-aurelius': {
    content: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  'creating-a-vision-board-that-actually-triggers-action': {
    content: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Fetch post based on slug
  useEffect(() => {
    if (!slug) return;
    const foundPost = POSTS.find(p => p.slug === slug);
    setPost(foundPost || null);
  }, [slug]);

  // Set page metadata for SEO dynamically
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | The Halic Quotes`;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      }
    } else {
      document.title = `Article Not Found | The Halic Quotes`;
    }
  }, [post]);

  if (!post) {
    return (

      <main className="grow hero-gradient py-24 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center max-w-md flex flex-col items-center gap-5 shadow-2xl"
        >
          <AlertCircle className="w-12 h-12 text-purple-500 animate-pulse" />
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
            Article Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The motivation guide you are looking for might have been moved or renamed.
          </p>
          <Link
            href="/blog"
            id="lnk-back-to-blog-notfound"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-500/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Blog List
          </Link>
        </motion.div>
      </main>

    );
  }

  const relatedQuote = RELATED_QUOTES[post.slug];

  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(null as any), 2500);
  };

  const handleShareArticle = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    if (!newsletterEmail.trim()) {
      setNewsletterError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Please provide a valid email address');
      return;
    }

    // Mock API call success
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (

    <main className="grow hero-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* Main Article Stream (Left / Column 1) */}
        <article className="w-full lg:w-2/3 flex flex-col gap-6">

          {/* Back to Blog Stream button */}
          <Link
            href="/blog"
            id="btn-back-to-blog"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 w-fit transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Articles
          </Link>

          {/* Article card wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-10 text-left relative overflow-hidden"
          >
            {/* Cover top glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-purple-600 via-violet-500 to-amber-500" />

            <header className="border-b border-slate-200/50 dark:border-slate-800/40 pb-6">
              {/* Category & Stats */}
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {post.category}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight leading-tight mb-4">
                {post.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold font-display shadow-md">
                    HM
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {post.author}
                    </span>
                    <span className="text-[9px] text-slate-400">Inspiration Specialist</span>
                  </div>
                </div>

                {/* Share button */}
                <button
                  onClick={handleShareArticle}
                  id="btn-share-article"
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm text-slate-500 hover:text-purple-600"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Link Copied!' : 'Share Article'}
                </button>
              </div>
            </header>

            {/* Rich Body Content formatted elegantly via Tailwind utility selectors */}
            <div
              className="mt-8 
                  [&_p]:text-sm sm:[&_p]:text-base [&_p]:text-slate-600 [&_p]:dark:text-slate-300 [&_p]:mb-5 [&_p]:leading-relaxed [&_p]:font-sans
                  [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-display [&_h2]:text-slate-900 [&_h2]:dark:text-slate-50 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3.5 [&_ul]:text-slate-600 [&_ul]:dark:text-slate-300 [&_ul]:text-sm sm:[&_ul]:text-base [&_ul]:font-sans
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-3.5 [&_ol]:text-slate-600 [&_ol]:dark:text-slate-300 [&_ol]:text-sm sm:[&_ol]:text-base [&_ol]:font-sans
                  [&_blockquote]:border-l-4 [&_blockquote]:border-purple-600 [&_blockquote]:pl-4 [&_blockquote]:py-1.5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_blockquote]:dark:text-slate-200 [&_blockquote]:bg-purple-500/5 [&_blockquote]:rounded-r-xl [&_blockquote]:pr-4
                  [&_strong]:font-bold [&_strong]:text-slate-950 [&_strong]:dark:text-slate-50
                  [&_a]:text-purple-600 [&_a]:hover:underline [&_a]:font-semibold"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related Quote card */}
            {relatedQuote && (
              <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/40">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mb-4 block">
                  Handpicked Companion Quote
                </span>

                <div className="p-6 rounded-2xl bg-linear-to-tr from-purple-500/5 to-indigo-500/5 border border-purple-500/10 dark:border-purple-500/5 text-left flex flex-col justify-between gap-4">
                  <p className="text-base sm:text-lg font-display font-medium text-slate-900 dark:text-slate-100 italic leading-relaxed">
                    "{relatedQuote.content}"
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                    <span className="text-xs font-bold text-slate-500">
                      — {relatedQuote.author}
                    </span>

                    <div className="flex gap-2">
                      {/* Wallpaper redirect link */}
                      <Link
                        href={`/wallpaper-generator?quote=${encodeURIComponent(relatedQuote.content)}&author=${encodeURIComponent(relatedQuote.author)}`}
                        id="lnk-wallpaper-related-quote"
                        className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:text-purple-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Wallpaper
                      </Link>

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopyQuote(relatedQuote.content)}
                        id="btn-copy-related-quote"
                        className="p-1.5 bg-white dark:bg-slate-900 rounded-xl text-slate-500 border border-slate-200 dark:border-slate-800 hover:text-emerald-500 transition-colors"
                        title="Copy Quote"
                      >
                        {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </article>

        {/* Interactive Panels & Widgets Sidebar (Right / Column 2) */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-6">

          {/* Quick Actions Panel */}
          <div className="glass-card p-6 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Motivation Ecosystem
            </h2>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">
              Take what you learned in this guide and apply it immediately using our mindset development tools.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/quotes/generator"
                id="lnk-blog-ai-generator"
                className="flex items-center justify-between p-3.5 rounded-xl border border-purple-500/10 hover:border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Quote Generator</span>
                    <span className="text-[9px] text-slate-500">Draft customized inspiration</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/wallpaper-generator"
                id="lnk-blog-wallpaper-gen"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Poster Designer</span>
                    <span className="text-[9px] text-slate-500">Create beautiful wallpapers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Premium Newsletter Signup Widget */}
          {/* <div className="glass-card p-6 text-left relative overflow-hidden bg-linear-to-tr from-purple-500/5 to-amber-500/5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-purple-500" />
              Weekly Refresher
            </h2>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
              Subscribe to receive fresh micro-philosophies, guide summaries, and curated quote digests every Monday morning.
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.form
                  key="form"
                  onSubmit={handleNewsletterSubmit}
                  id="form-newsletter-signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-1 relative">
                    <input
                      type="email"
                      id="input-newsletter-email"
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500 font-sans"
                    />
                    {newsletterError && (
                      <span className="text-[9px] text-red-500 font-semibold flex items-center gap-0.5 mt-0.5">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {newsletterError}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="btn-newsletter-submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5"
                  >
                    Subscribe Now
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl gap-2 mt-2"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">You are subscribed!</span>
                  <span className="text-[10px] text-slate-500">Check your inbox next Monday.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

        </aside>

      </div>
    </main>


  );
}
