import React from 'react';
import { PageView } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Bot,
  Languages,
  CheckCircle2,
  ArrowRight,
  Brain,
  Award,
  Users,
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          About InterviewAce AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Empowering Job Seekers with AI Mock Practice
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Practice smarter. Interview with AI. Get hired with confidence.
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-3">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
            The Problem
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Lack of Realistic Interview Practice
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Students and job seekers struggle to find realistic interview environments. Static online questions don't offer real-time evaluation, personalized feedback, or actionable improvement steps.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
            The Solution
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Personalized AI Interviewer
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            InterviewAce AI conducts live mock interviews tailored specifically to your target job role, evaluates your answers across 6 key metrics, rewrites model answers, and builds a 7-day preparation roadmap.
          </p>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Who InterviewAce AI is Built For
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {[
            'University Students',
            'Fresh Graduates',
            'Software Developers',
            'Internship Applicants',
            'HR Professionals',
            'Career Changers',
            'Teachers & Educators',
            'Accountants & Analysts',
            'Graphic Designers',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold">100% Client-Side Local Privacy</h2>
            <p className="text-xs text-slate-300">No account required. No server database storage.</p>
          </div>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          InterviewAce AI does not collect personal credentials or require user registration. All your interview transcripts, evaluations, scores, and roadmaps are saved directly in your browser's local storage.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('setup')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <span>Start Your Practice Interview</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
