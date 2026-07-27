import React, { useState, useEffect, useRef } from 'react';
import { InterviewConfig, QAItem } from '../types';
import {
  Volume2,
  Mic,
  MicOff,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Award,
  Lightbulb,
  ArrowRight,
  Flag,
} from 'lucide-react';

interface InterviewProps {
  config: InterviewConfig;
  currentQuestionIndex: number;
  currentQuestionText: string;
  contextNote?: string;
  qaList: QAItem[];
  onSubmitAnswer: (answer: string) => Promise<void>;
  onPreviousQuestion: () => void;
  onFinishEarly: () => void;
  isEvaluating: boolean;
  errorMessage?: string | null;
}

export const Interview: React.FC<InterviewProps> = ({
  config,
  currentQuestionIndex,
  currentQuestionText,
  contextNote,
  qaList,
  onSubmitAnswer,
  onPreviousQuestion,
  onFinishEarly,
  isEvaluating,
  errorMessage,
}) => {
  const [answerInput, setAnswerInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const [showInstantFeedback, setShowInstantFeedback] = useState<boolean>(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  const currentQA = qaList[currentQuestionIndex];
  const isAnswered = currentQA && currentQA.score !== undefined;

  // Sync answer input when changing question views
  useEffect(() => {
    if (currentQA) {
      setAnswerInput(currentQA.userAnswer || '');
    } else {
      setAnswerInput('');
    }
  }, [currentQuestionIndex, currentQA]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Text-To-Speech (Listen Question)
  const handleToggleSpeakQuestion = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestionText);

    if (config.language === 'Urdu') {
      utterance.lang = 'ur-PK';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Typing)
  const handleToggleVoiceTyping = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge for voice typing.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      if (config.language === 'Urdu') {
        recognition.lang = 'ur-PK';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEvaluating) return;
    await onSubmitAnswer(answerInput.trim());
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / config.questionCount) * 100);

  return (
    <div id="interview-page" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
              Q{currentQuestionIndex + 1}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                {config.role} Mock Interview
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                  {config.difficulty}
                </span>
                <span>•</span>
                <span>{config.type} Round</span>
                <span>•</span>
                <span>{config.language}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="finish-interview-early-btn"
              onClick={() => setShowFinishConfirmModal(true)}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Flag className="w-3.5 h-3.5" />
              Finish Early
            </button>
          </div>
        </div>

        {/* Question Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Question {currentQuestionIndex + 1} of {config.questionCount}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                InterviewAce AI
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                AI Interviewer Persona
              </span>
            </div>
          </div>

          <button
            id="read-aloud-question-btn"
            onClick={handleToggleSpeakQuestion}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSpeakingQuestion
                ? 'bg-purple-600 text-white animate-pulse'
                : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeakingQuestion ? 'Speaking...' : 'Read Aloud'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestionText}
          </h2>

          {contextNote && (
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Interviewer Hint:</span>
                <span>{contextNote}</span>
              </div>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Your Answer</span>
              <span className="text-slate-400 font-normal">
                ({answerInput.length} characters)
              </span>
            </label>

            <button
              type="button"
              id="voice-typing-btn"
              onClick={handleToggleVoiceTyping}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Stop Dictating' : 'Voice Typing'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="answer-textarea"
              rows={6}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder={`Type your detailed response here... (Tip: Structure your response using Situation, Task, Action, and Result in ${config.language})`}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
            />
          </div>

          {/* Previous Evaluation Banner if already answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  Answer Evaluated — Score: {currentQA.score}/10
                </span>
                <button
                  type="button"
                  onClick={() => setShowInstantFeedback(!showInstantFeedback)}
                  className="text-xs font-bold text-purple-700 dark:text-purple-300 underline cursor-pointer"
                >
                  {showInstantFeedback ? 'Hide AI Review' : 'View AI Review'}
                </button>
              </div>

              {showInstantFeedback && (
                <div className="pt-2 text-xs space-y-2 text-slate-700 dark:text-slate-300 border-t border-purple-200 dark:border-purple-800">
                  <p><strong>Feedback:</strong> {currentQA.feedback}</p>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    <strong>Model Answer:</strong> {currentQA.betterAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
            <button
              type="button"
              id="prev-question-btn"
              disabled={currentQuestionIndex === 0 || isEvaluating}
              onClick={onPreviousQuestion}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <button
              type="submit"
              id="submit-answer-next-btn"
              disabled={isEvaluating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer & Preparing Next...</span>
                </>
              ) : (
                <>
                  <span>
                    {currentQuestionIndex + 1 === config.questionCount
                      ? 'Submit & Generate Final Evaluation Report'
                      : 'Submit & Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Early Finish Confirmation Modal */}
      {showFinishConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-600" />
              Finish Interview Early?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are currently on Question {currentQuestionIndex + 1} of {config.questionCount}. Finshing now will evaluate your performance based on answered questions so far and generate your report.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                Continue Interview
              </button>
              <button
                type="button"
                id="confirm-finish-early-btn"
                onClick={() => {
                  setShowFinishConfirmModal(false);
                  onFinishEarly();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
              >
                Yes, Generate Final Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
