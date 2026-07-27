import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { APISettings } from './components/APISettings';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { Interview } from './pages/Interview';
import { Results } from './pages/Results';
import { HistoryPage } from './pages/History';
import { AboutPage } from './pages/About';

import {
  PageView,
  InterviewConfig,
  QAItem,
  InterviewReport,
} from './types';

import {
  apiStartInterview,
  apiEvaluateStep,
  apiEvaluateFinal,
} from './services/api';

import {
  saveReportToHistory,
  getStoredTheme,
  setStoredTheme,
} from './services/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [presetRole, setPresetRole] = useState<string>('');

  // Interview state
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
  const [contextNote, setContextNote] = useState<string>('');
  const [qaList, setQaList] = useState<QAItem[]>([]);
  const [currentReport, setCurrentReport] = useState<InterviewReport | null>(null);

  // Status state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedInHistory, setIsSavedInHistory] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Theme Initialization
  useEffect(() => {
    const savedDark = getStoredTheme();
    setIsDark(savedDark);
    document.documentElement.classList.toggle('dark', savedDark);
    document.documentElement.style.colorScheme = savedDark ? 'dark' : 'light';
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    setStoredTheme(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    document.documentElement.style.colorScheme = nextDark ? 'dark' : 'light';
  };

  const handleNavigate = (page: PageView, rolePreset?: string) => {
    setErrorMessage(null);
    if (rolePreset) {
      setPresetRole(rolePreset);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Start Interview Handler
  const handleStartInterview = async (newConfig: InterviewConfig) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setConfig(newConfig);
      const res = await apiStartInterview(newConfig);

      setCurrentQuestionIndex(0);
      setCurrentQuestionText(res.question);
      setContextNote(res.contextNote || '');
      setQaList([
        {
          questionIndex: 0,
          question: res.question,
          userAnswer: '',
        },
      ]);

      setCurrentPage('interview');
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setErrorMessage(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Single Answer Handler
  const handleSubmitAnswer = async (answer: string) => {
    if (!config) return;

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      // Step A: Evaluate current question answer
      const evalRes = await apiEvaluateStep({
        config,
        currentQuestionIndex,
        question: currentQuestionText,
        answer,
        previousQA: qaList,
      });

      // Update current question in qaList
      const updatedQAItem: QAItem = {
        questionIndex: currentQuestionIndex,
        question: currentQuestionText,
        userAnswer: answer,
        score: evalRes.score,
        feedback: evalRes.feedback,
        betterAnswer: evalRes.betterAnswer,
        keyTakeaway: evalRes.keyTakeaway,
      };

      const newQaList = [...qaList];
      newQaList[currentQuestionIndex] = updatedQAItem;
      setQaList(newQaList);

      const isLastQuestion = currentQuestionIndex + 1 >= config.questionCount || !evalRes.nextQuestion;

      if (!isLastQuestion && evalRes.nextQuestion) {
        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestionText(evalRes.nextQuestion);

        // Add placeholder if not exists
        if (!newQaList[nextIndex]) {
          newQaList[nextIndex] = {
            questionIndex: nextIndex,
            question: evalRes.nextQuestion,
            userAnswer: '',
          };
          setQaList(newQaList);
        }
      } else {
        // Generate Final Report
        await handleFinishAndGenerateReport(config, newQaList);
      }
    } catch (err: any) {
      console.error('Failed to evaluate answer:', err);
      setErrorMessage(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 3. Finalize & Generate Report Handler
  const handleFinishAndGenerateReport = async (cfg: InterviewConfig, currentQAs: QAItem[]) => {
    setIsLoading(true);
    try {
      const finalData = await apiEvaluateFinal({
        config: cfg,
        qaList: currentQAs,
      });

      const fullReport: InterviewReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: new Date().toISOString(),
        config: cfg,
        overallScore: finalData.overallScore,
        breakdown: finalData.breakdown,
        strengths: finalData.strengths,
        weaknesses: finalData.weaknesses,
        professionalSummary: finalData.professionalSummary,
        roadmap: finalData.roadmap,
        suggestedTopics: finalData.suggestedTopics,
        recommendedQuestions: finalData.recommendedQuestions,
        qaList: currentQAs,
      };

      setCurrentReport(fullReport);
      // Auto save to local storage
      saveReportToHistory(fullReport);
      setIsSavedInHistory(true);

      setCurrentPage('results');
    } catch (err: any) {
      console.error('Failed to generate final report:', err);
      setErrorMessage(err.message || 'Failed to generate final report.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Manual Finish Early
  const handleFinishEarly = async () => {
    if (!config) return;
    await handleFinishAndGenerateReport(config, qaList);
  };

  // 5. Navigate Previous Question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setCurrentQuestionText(qaList[prevIdx].question);
    }
  };

  // 6. Retake Interview
  const handleRetake = () => {
    if (config) {
      handleStartInterview(config);
    } else {
      setCurrentPage('setup');
    }
  };

  // 7. Save Report Manual Button
  const handleSaveReportManual = () => {
    if (currentReport) {
      saveReportToHistory(currentReport);
      setIsSavedInHistory(true);
    }
  };

  // 8. Select Report from History
  const handleSelectReportFromHistory = (report: InterviewReport) => {
    setCurrentReport(report);
    setConfig(report.config);
    setIsSavedInHistory(true);
    setCurrentPage('results');
  };

  // 9. Retake Report from History
  const handleRetakeFromHistory = (report: InterviewReport) => {
    handleStartInterview(report.config);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-purple-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main View Container */}
      <main className="pb-16">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {currentPage === 'setup' && (
          <Setup
            initialRolePreset={presetRole}
            onStartInterview={handleStartInterview}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {currentPage === 'interview' && config && (
          <Interview
            config={config}
            currentQuestionIndex={currentQuestionIndex}
            currentQuestionText={currentQuestionText}
            contextNote={contextNote}
            qaList={qaList}
            onSubmitAnswer={handleSubmitAnswer}
            onPreviousQuestion={handlePreviousQuestion}
            onFinishEarly={handleFinishEarly}
            isEvaluating={isEvaluating || isLoading}
            errorMessage={errorMessage}
          />
        )}

        {currentPage === 'results' && currentReport && (
          <Results
            report={currentReport}
            onRetake={handleRetake}
            onSaveHistory={handleSaveReportManual}
            isSavedInHistory={isSavedInHistory}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            onSelectReport={handleSelectReportFromHistory}
            onRetakeFromHistory={handleRetakeFromHistory}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </main>

      <APISettings show={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
