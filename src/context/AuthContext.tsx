'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'GUEST' | 'FREE' | 'PREMIUM' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  updateInterests: (interests: string[]) => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: Record<UserRole, User> = {
  GUEST: { id: 'guest', name: 'Guest Explorer', email: 'guest@halicquotes.com', role: 'GUEST', interests: [] },
  FREE: { id: 'free-user', name: 'Alex Free', email: 'alex@halicquotes.com', role: 'FREE', interests: ['Success', 'Discipline'] },
  PREMIUM: { id: 'premium-user', name: 'Jordan Gold', email: 'jordan@halicquotes.com', role: 'PREMIUM', interests: ['Success', 'Leadership', 'Productivity'] },
  ADMIN: { id: 'admin-user', name: 'Halic Admin', email: 'admin@halicquotes.com', role: 'ADMIN', interests: ['Success', 'Leadership', 'Business'] },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('halic_quotes_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEFAULT_USERS['FREE']);
      }
    } else {
      // Default to FREE user for demo ease
      setUser(DEFAULT_USERS['FREE']);
      localStorage.setItem('halic_quotes_user', JSON.stringify(DEFAULT_USERS['FREE']));
    }
    setIsLoaded(true);
  }, []);

  const login = (role: UserRole) => {
    const selectedUser = DEFAULT_USERS[role];
    setUser(selectedUser);
    localStorage.setItem('halic_quotes_user', JSON.stringify(selectedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('halic_quotes_user');
  };

  const updateInterests = (interests: string[]) => {
    if (!user) return;
    const updatedUser = { ...user, interests };
    setUser(updatedUser);
    localStorage.setItem('halic_quotes_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateInterests, isLoaded }}>
      {children}
      {/* Floating Demo Session Selector */}
      {isLoaded && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 rounded-xl bg-slate-900/90 p-3 text-xs text-white shadow-2xl backdrop-blur-md border border-slate-800 pointer-events-auto">
          <div className="font-semibold text-purple-400">Demo Role Selector</div>
          <div className="text-[10px] text-slate-400">Current: <span className="text-white font-bold">{user?.role || 'Logged Out'}</span></div>
          <div className="flex gap-1 mt-1">
            {(['FREE', 'PREMIUM', 'ADMIN', 'GUEST'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => login(r)}
                className={`px-2 py-1 rounded transition-colors ${
                  user?.role === r 
                    ? 'bg-purple-600 font-bold' 
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
