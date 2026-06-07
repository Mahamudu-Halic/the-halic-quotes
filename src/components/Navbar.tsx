'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Flame, Sparkles, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, login } = useAuth();
  const [streak, setStreak] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch streak count from API
    if (user && user.role !== 'GUEST') {
      fetch(`/api/user/progress?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.streakCount) {
            setStreak(data.streakCount);
          }
        })
        .catch((e) => console.log('Error loading streak', e));
    }
  }, [user]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Generator', path: '/quotes/generator', icon: Sparkles },
    { name: 'Wallpapers', path: '/wallpaper-generator' },
    { name: 'AI Coach', path: '/coach', premiumOnly: true },
    { name: 'Vision Board', path: '/dashboard/vision-board' },
    { name: 'Categories', path: '/quotes/categories' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/40 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
                Q
              </span>
              <span className="text-xl font-bold font-display tracking-tight bg-linear-to-r from-purple-600 via-violet-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90">
                TheHalicQuotes
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${isActive
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-purple-500" />}
                  {link.name}
                  {link.premiumOnly && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded font-bold uppercase tracking-wider scale-90">
                      Pro
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action buttons / User tools */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Streak indicator */}
            {user && user.role !== 'GUEST' && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all shadow-sm"
                title="Your Motivation Streak"
              >
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{streak} Day Streak</span>
              </Link>
            )}

            {/* Dashboard shortcut */}
            {user && (
              <Link
                href="/dashboard"
                className="p-2 rounded-xl text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all hover:scale-105"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User status */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-500/20">
                <UserIcon className="w-4 h-4" />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold leading-none">{user?.name || 'Explorer'}</span>
                <span className="text-[9px] text-slate-500 leading-normal">{user?.role || 'Guest'}</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${pathname === link.path
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400'
                }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.premiumOnly && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">
                    PRO
                  </span>
                )}
              </div>
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300"
            >
              User Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
