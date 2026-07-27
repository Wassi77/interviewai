import React from 'react';
import { PageView } from '../types';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  FileCheck2,
  CalendarCheck,
  ShieldCheck,
  Languages,
  CheckCircle2,
  Briefcase,
  Bot,
  Award,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageView, rolePreset?: string) => void;
}

const POPULAR_ROLES = [
  'Frontend Developer',
  'Software Engineer',
  'React Developer',
  'HR Manager',
  'Accountant',
  'Teacher',
  'Graphic Designer',
  'AI Engineer',
  'Medical Receptionist',
  'WordPress Developer',
  'Flutter Developer',
  'Data Analyst',
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div id="home-page" className="min-h-screen space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Glow ambient decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            AI-Powered Mock Interview Simulator
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Ace Your Next Interview with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Practice smarter. Interview with AI. Get hired with confidence. Realistic mock interviews tailored to any job role, with instant feedback and a 7-day preparation roadmap.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-start-interview-btn"
              onClick={() => onNavigate('setup')}
              className="flex items-center gap-3 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Start Interview Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-view-history-btn"
              onClick={() => onNavigate('history')}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl backdrop-blur-md active:scale-95 transition-all cursor-pointer"
            >
              <span>View Past History</span>
            </button>
          </div>

          {/* Key Value Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Any Job Role Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>English, Urdu & Roman Urdu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Login & Local Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Select Preset Roles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Pick or Search Any Role to Begin
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click a popular role below or type your exact target job in setup.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {POPULAR_ROLES.map((role) => (
            <button
              key={role}
              id={`preset-role-${role.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onNavigate('setup', role)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <span>{role}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8 py-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How InterviewAce AI Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From customized question generation to actionable 7-day preparation roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Setup Interview
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter any job role (e.g., Software Engineer, HR, Teacher), choose difficulty (Easy, Medium, Hard), language, and question count.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              AI-Guided Questions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI asks one tailored question at a time. Type or use voice dictation to answer naturally without pressure.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Instant Feedback
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get detailed scoring across 6 key metrics, see strengths & weaknesses, and read AI's professionally rewritten model answers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Download & Roadmap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get an actionable 7-day preparation roadmap and download a complete PDF report for study offline.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Core Features
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need to Get Hired
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Realistic AI Interviewer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Simulates real-world interviewer behavior for Technical, HR, or Mixed rounds across any seniority level.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-indigo-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              English, Urdu & Roman Urdu
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Practice in English, Urdu script, or Roman Urdu so candidates feel comfortable expressing their ideas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-purple-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              6-Metric Detailed Breakdown
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Evaluates Communication, Technical Depth, Confidence, Problem Solving, Grammar, and Professionalism out of 10.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-purple-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Rewritten Better Answers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compares candidate responses with professional model answers to learn standard industry framing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              7-Day Actionable Roadmap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Custom daily study plan targeting weakness areas to prepare systematically before the real interview.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Instant PDF Download
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export high-resolution PDF report containing scores, Q&A, feedback, and roadmap for offline reference.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          InterviewAce AI — Practice smarter. Interview with AI. Get hired with confidence.
        </p>
        <p>No registration or backend database required. All interview data resides securely in your browser's local storage.</p>
      </footer>
    </div>
  );
};
