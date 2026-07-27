import React from 'react';
import { PageView } from '../types';
import { Sparkles, Moon, Sun, History, Home, Info, PlayCircle, ShieldCheck, Settings2 } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          id="nav-logo-button"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 dark:from-blue-200 dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                InterviewAce
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Smart Mock Interviewer
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPage === 'home'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>

          <button
            id="nav-setup-btn"
            onClick={() => onNavigate('setup')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPage === 'setup' || currentPage === 'interview'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Start Practice
          </button>

          <button
            id="nav-history-btn"
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPage === 'history' || currentPage === 'results'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          <button
            id="nav-about-btn"
            onClick={() => onNavigate('about')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPage === 'about'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Privacy badge pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Local Privacy
          </div>

          {/* Settings */}
          <button
            id="settings-btn"
            onClick={onOpenSettings}
            aria-label="API Settings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Start CTA */}
          <button
            id="header-start-btn"
            onClick={() => onNavigate('setup')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            New Interview
          </button>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            currentPage === 'home' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={() => onNavigate('setup')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            currentPage === 'setup' || currentPage === 'interview' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          Setup
        </button>
        <button
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            currentPage === 'history' || currentPage === 'results' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            currentPage === 'about' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Info className="w-4 h-4" />
          About
        </button>
      </div>
    </header>
  );
};
