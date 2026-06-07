'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Copy, Download, User, ArrowLeft, RefreshCw, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  mood: string | null;
  tags: string | null;
  likes: any[];
}

export default function AuthorProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [authorName, setAuthorName] = useState('');
  const [bio, setBio] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map slug to full name
  useEffect(() => {
    if (!slug) return;

    const formattedName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    setAuthorName(formattedName);
    fetchAuthorQuotes(formattedName);
  }, [slug]);

  const fetchAuthorQuotes = async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes?author=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotes(data);
        if (data.length > 0 && data[0].authorBio) {
          setBio(data[0].authorBio);
        } else {
          setBio(`Curated motivational quotes and teachings from ${name}. Explore their philosophy and life lessons.`);
        }
      }
    } catch (e) {
      console.log('Error loading author quotes', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalLikes = quotes.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);

  return (

    <main className="grow hero-gradient py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 mb-8 w-fit transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Explore
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Gathering author quotes...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-8">

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-left relative overflow-hidden flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center border-4 border-purple-500/20 shadow-lg shrink-0">
                <User className="w-10 h-10" />
              </div>
              <div className="grow text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 mb-2">
                  {authorName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  {bio}
                </p>

                {/* Stats columns */}
                <div className="flex gap-6 mt-6 justify-center md:justify-start">
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
                      {quotes.length}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                      Total Quotes
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-amber-500 font-display">
                      {totalLikes}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                      Platform Likes
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quotes listing */}
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mb-6 text-left">
                Wisdom Feed from {authorName}
              </h2>

              <div className="flex flex-col gap-4">
                {quotes.map((quote, idx) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-6 text-left flex flex-col justify-between gap-4"
                  >
                    <p className="text-base sm:text-lg font-display italic text-slate-800 dark:text-slate-200">
                      "{quote.content}"
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                        {quote.category}
                      </span>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/wallpaper-generator?quote=${encodeURIComponent(quote.content)}&author=${encodeURIComponent(quote.author)}`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-purple-600 transition-colors"
                          title="Generate Wallpaper"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleCopy(quote.content, quote.id)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-emerald-500 transition-colors"
                        >
                          {copiedId === quote.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>


  );
}
