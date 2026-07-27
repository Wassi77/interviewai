import React, { useState } from 'react';
import { InterviewReport } from '../types';
import { generatePDFReport } from '../services/pdf';
import {
  Award,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  MessageSquare,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  BookmarkPlus,
  Briefcase,
  Check,
} from 'lucide-react';

interface ResultsProps {
  report: InterviewReport;
  onRetake: () => void;
  onSaveHistory: () => void;
  isSavedInHistory: boolean;
}

export const Results: React.FC<ResultsProps> = ({
  report,
  onRetake,
  onSaveHistory,
  isSavedInHistory,
}) => {
  const [openQAIndex, setOpenQAIndex] = useState<number | null>(0);
  const [downloadingPDF, setDownloadingPDF] = useState<boolean>(false);

  const handleDownloadPDF = () => {
    setDownloadingPDF(true);
    try {
      generatePDFReport(report);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setDownloadingPDF(false), 800);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/50';
    return 'text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/50';
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div id="results-page" className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Evaluation Complete
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Interview Evaluation Report
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {report.config.role} • {report.config.difficulty} • {report.config.type} Round • {report.config.language}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="download-pdf-report-btn"
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>{downloadingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>

            <button
              id="save-history-btn"
              onClick={onSaveHistory}
              disabled={isSavedInHistory}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSavedInHistory
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isSavedInHistory ? <Check className="w-4 h-4 text-emerald-400" /> : <BookmarkPlus className="w-4 h-4" />}
              <span>{isSavedInHistory ? 'Saved to History' : 'Save Report'}</span>
            </button>

            <button
              id="retake-interview-btn"
              onClick={onRetake}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Interview</span>
            </button>
          </div>
        </div>

        {/* Score Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          {/* Circular overall score gauge */}
          <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-center space-y-1">
              <div className="text-5xl font-black tracking-tight text-white">
                {report.overallScore}<span className="text-xl text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                Overall Candidate Score
              </span>
              <p className="text-[11px] text-slate-400">
                {report.overallScore >= 80
                  ? 'Strong Hire Recommendation'
                  : report.overallScore >= 60
                  ? 'Promising with targeted practice'
                  : 'Needs fundamental review'}
              </p>
            </div>
          </div>

          {/* Professional summary text */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-center space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Interviewer Executive Summary
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {report.professionalSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 6-Metric Breakdown Grid */}
      <section className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Performance Breakdown (Score out of 10)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Communication', score: report.breakdown.communication },
            { label: 'Technical Knowledge', score: report.breakdown.technicalKnowledge },
            { label: 'Confidence', score: report.breakdown.confidence },
            { label: 'Problem Solving', score: report.breakdown.problemSolving },
            { label: 'Grammar', score: report.breakdown.grammar },
            { label: 'Professionalism', score: report.breakdown.professionalism },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-extrabold">
                  {item.score}/10
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full ${getBarColor(item.score)} transition-all duration-500`}
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths vs Weaknesses */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-4">
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Key Candidate Strengths
          </h2>
          <ul className="space-y-2.5">
            {report.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-emerald-950 dark:text-emerald-200 leading-relaxed">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✔</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-4">
          <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Areas for Improvement
          </h2>
          <ul className="space-y-2.5">
            {report.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-rose-950 dark:text-rose-200 leading-relaxed">
                <span className="text-rose-600 font-bold shrink-0 mt-0.5">✖</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Question-by-Question Evaluation & Better Answers */}
      <section className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Detailed Question-by-Question Review
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {report.qaList.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {report.qaList.map((qa, i) => {
            const isOpen = openQAIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenQAIndex(isOpen ? null : i)}
                  className="w-full p-4 text-left bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                      Q{i + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {qa.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                      {qa.score !== undefined ? `${qa.score}/10` : 'Evaluated'}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 bg-white dark:bg-slate-800 space-y-4 text-xs border-t border-slate-200 dark:border-slate-700">
                    {/* User's Answer */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Answer:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic">
                        "{qa.userAnswer || 'No answer provided'}"
                      </p>
                    </div>

                    {/* Feedback */}
                    <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                      <span className="font-bold text-purple-900 dark:text-purple-200 block mb-1">
                        AI Feedback:
                      </span>
                      <p className="text-purple-950 dark:text-purple-100 leading-relaxed">
                        {qa.feedback}
                      </p>
                    </div>

                    {/* Better Answer */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                        AI Rewritten Model Answer:
                      </span>
                      <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-normal">
                        {qa.betterAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Day Actionable Roadmap */}
      {report.roadmap && report.roadmap.length > 0 && (
        <section className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              7-Day Preparation Roadmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A daily preparation plan targeting your weak areas for the {report.config.role} role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.roadmap.map((dayItem) => (
              <div
                key={dayItem.day}
                className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-extrabold text-[11px]">
                    Day {dayItem.day}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                    {dayItem.focus}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  {dayItem.title}
                </h3>

                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {dayItem.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Topics & Recommended Practice Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suggested Topics */}
        {report.suggestedTopics && report.suggestedTopics.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Suggested Study Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.suggestedTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Practice Questions */}
        {report.recommendedQuestions && report.recommendedQuestions.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Recommended Practice Questions
            </h2>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {report.recommendedQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="font-bold text-purple-600 shrink-0">#{idx + 1}</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
