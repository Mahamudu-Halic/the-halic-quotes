'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const AUTHORS_LIST = [
  { name: 'Steve Jobs', slug: 'steve-jobs', tagline: 'Pioneer of PC revolution & Apple Co-founder', era: 'Modern' },
  { name: 'Winston Churchill', slug: 'winston-churchill', tagline: 'British Prime Minister & Nobel Laureate', era: '20th Century' },
  { name: 'Oprah Winfrey', slug: 'oprah-winfrey', tagline: 'Media Leader, Philanthropist & Talk Host', era: 'Modern' },
  { name: 'Nelson Mandela', slug: 'nelson-mandela', tagline: 'South African President & Peace activist', era: '20th Century' },
  { name: 'Maya Angelou', slug: 'maya-angelou', tagline: 'Poet, Memoirist & Civil Rights campaigner', era: '20th Century' },
  { name: 'Marcus Aurelius', slug: 'marcus-aurelius', tagline: 'Roman Emperor & Stoic Philosopher', era: 'Ancient' },
  { name: 'Albert Einstein', slug: 'albert-einstein', tagline: 'Theoretical Physicist & Thinker', era: '20th Century' }
];

export default function AuthorsPage() {
  return (

    <main className="grow hero-gradient py-16 px-4">
      <div className="max-w-4xl mx-auto text-left">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            Explore Wisdom by Author
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Read biographies, explore statistics, and follow quotes from history's most inspiring minds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {AUTHORS_LIST.map((author, index) => (
            <motion.div
              key={author.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 flex items-start gap-4 hover:border-purple-500/20 duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center border border-purple-500/20 shrink-0 font-bold">
                {author.name.charAt(0)}
              </div>

              <div className="grow flex flex-col justify-between h-full text-left">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-sm font-bold font-display text-slate-900 dark:text-slate-50">
                      {author.name}
                    </h2>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 font-semibold font-sans">
                      {author.era}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mb-3">
                    {author.tagline}
                  </p>
                </div>

                <Link
                  href={`/quotes/authors/${author.slug}`}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 w-fit"
                >
                  <span>View profile & quotes</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>


  );
}
