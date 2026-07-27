import React, { useState, useEffect } from 'react';
import { InterviewConfig, Difficulty, InterviewLanguage, InterviewType } from '../types';
import {
  Briefcase,
  Layers,
  Languages,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';

interface SetupProps {
  initialRolePreset?: string;
  onStartInterview: (config: InterviewConfig) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const PRESET_ROLES = [
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

export const Setup: React.FC<SetupProps> = ({
  initialRolePreset,
  onStartInterview,
  isLoading,
  errorMessage,
}) => {
  const [role, setRole] = useState<string>(initialRolePreset || 'Frontend Developer');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [language, setLanguage] = useState<InterviewLanguage>('English');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [type, setType] = useState<InterviewType>('Mixed');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (initialRolePreset) {
      setRole(initialRolePreset);
    }
  }, [initialRolePreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      setValidationError('Please enter or select a job role.');
      return;
    }
    setValidationError('');
    onStartInterview({
      role: role.trim(),
      difficulty,
      language,
      type,
      questionCount,
    });
  };

  return (
    <div id="setup-page" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          Customize Your Mock Interview
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Configure Your AI Interview
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Tailor your role, difficulty level, language, and interview format. InterviewAce AI will adapt its questions to match.
        </p>
      </div>

      {/* Global Error Banner */}
      {(errorMessage || validationError) && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Setup Issue</p>
            <p className="text-xs">{errorMessage || validationError}</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-8">
        {/* 1. Job Role Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            1. Desired Job Role <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Type any job title without limits (e.g., Software Engineer, HR, Teacher, Medical Receptionist, Graphic Designer).
          </p>

          <input
            id="job-role-input"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior React Developer, Content Writer, AI Engineer..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />

          {/* Quick select pills */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Popular Quick-Select Roles:
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_ROLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  id={`preset-role-pill-${item.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setRole(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    role.toLowerCase() === item.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Difficulty Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            2. Difficulty Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Easy', label: 'Easy', subtitle: 'Junior / Entry Level questions' },
              { id: 'Medium', label: 'Medium', subtitle: 'Mid-Level practical scenario questions' },
              { id: 'Hard', label: 'Hard', subtitle: 'Senior / Lead deep architecture questions' },
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                id={`difficulty-btn-${diff.id.toLowerCase()}`}
                onClick={() => setDifficulty(diff.id as Difficulty)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  difficulty === diff.id
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm">{diff.label}</span>
                  {difficulty === diff.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {diff.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Language Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            3. Interview Language
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'English', label: 'English', desc: 'Standard professional English' },
              { id: 'Urdu', label: 'Urdu (اردو)', desc: 'Full Urdu script' },
              { id: 'Roman Urdu', label: 'Roman Urdu', desc: 'Urdu in Roman alphabet' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                id={`lang-btn-${lang.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setLanguage(lang.id as InterviewLanguage)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  language === lang.id
                    ? 'border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm">{lang.label}</span>
                  {language === lang.id && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {lang.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Number of Questions & Interview Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question Count */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              4. Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  id={`qcount-btn-${num}`}
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    questionCount === num
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              5. Interview Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Technical', label: 'Technical' },
                { id: 'HR', label: 'HR' },
                { id: 'Mixed', label: 'Mixed' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  id={`type-btn-${t.id.toLowerCase()}`}
                  onClick={() => setType(t.id as InterviewType)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    type === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            id="start-interview-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing Interview Environment with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Start Interview for "{role}"</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
