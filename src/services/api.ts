import { InterviewConfig, QAItem, InterviewReport, APIConfig } from '../types';
import { getAPIConfig } from './storage';

function getApiConfig(): APIConfig {
  const cfg = getAPIConfig();
  if (!cfg.apiKey) {
    throw new Error('API key not configured. Please open Settings (gear icon) and set your API provider details.');
  }
  return cfg;
}

async function parseResponseError(res: Response, fallbackAction: string): Promise<string> {
  let errorMsg = '';
  try {
    const data = await res.json();
    errorMsg = data.error || data.message || (typeof data === 'string' ? data : '');
  } catch {
    const text = await res.text().catch(() => '');
    errorMsg = text || `HTTP ${res.status} ${res.statusText}`;
  }

  if (!errorMsg || errorMsg.trim() === '') {
    if (res.status === 404) {
      errorMsg = 'API endpoint not found (404). Check Vercel deployment logs.';
    } else if (res.status === 504) {
      errorMsg = 'Serverless function timed out (504). Your AI provider may be slow. Try again or switch to a faster model in Settings.';
    } else {
      errorMsg = `${fallbackAction} (HTTP ${res.status}). Check Vercel Function Logs for details.`;
    }
  }

  return errorMsg;
}

export async function apiStartInterview(config: InterviewConfig) {
  const apiConfig = getApiConfig();
  let res: Response;
  try {
    res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, apiConfig }),
    });
  } catch (netErr: any) {
    throw new Error('Network error: Unable to connect to server. Check your internet or Vercel deployment.');
  }

  if (!res.ok) {
    const errorMsg = await parseResponseError(res, 'Failed to start interview');
    throw new Error(errorMsg);
  }

  return res.json() as Promise<{
    questionIndex: number;
    question: string;
    contextNote?: string;
  }>;
}

export async function apiEvaluateStep(params: {
  config: InterviewConfig;
  currentQuestionIndex: number;
  question: string;
  answer: string;
  previousQA: QAItem[];
}) {
  const apiConfig = getApiConfig();
  let res: Response;
  try {
    res = await fetch('/api/interview/evaluate-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, apiConfig }),
    });
  } catch (netErr: any) {
    throw new Error('Network error during response evaluation.');
  }

  if (!res.ok) {
    const errorMsg = await parseResponseError(res, 'Failed to evaluate answer');
    throw new Error(errorMsg);
  }

  return res.json() as Promise<{
    score: number;
    feedback: string;
    betterAnswer: string;
    keyTakeaway: string;
    nextQuestion: string | null;
  }>;
}

export async function apiEvaluateFinal(params: {
  config: InterviewConfig;
  qaList: QAItem[];
}) {
  const apiConfig = getApiConfig();
  let res: Response;
  try {
    res = await fetch('/api/interview/evaluate-final', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, apiConfig }),
    });
  } catch (netErr: any) {
    throw new Error('Network error generating final report.');
  }

  if (!res.ok) {
    const errorMsg = await parseResponseError(res, 'Failed to generate final report');
    throw new Error(errorMsg);
  }

  return res.json() as Promise<Omit<InterviewReport, 'id' | 'date' | 'config' | 'qaList'>>;
}
