'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getActivePosts, BlogPost } from '@/lib/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getActivePosts());
  }, []);

  return (


    <main className="grow hero-gradient py-16 px-4">
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
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:border-purple-500/20 duration-300 hover:scale-[1.01] transition-transform"
              >
                <div className="grow flex flex-col justify-between gap-3">
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

                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 group w-fit hover:underline mt-4">
                    Read article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </main>

  );
}

