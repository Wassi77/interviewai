export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type InterviewLanguage = 'English' | 'Urdu' | 'Roman Urdu';
export type InterviewType = 'Technical' | 'HR' | 'Mixed';

export interface InterviewConfig {
  role: string;
  difficulty: Difficulty;
  language: InterviewLanguage;
  type: InterviewType;
  questionCount: number;
}

export interface QAItem {
  questionIndex: number;
  question: string;
  userAnswer: string;
  score?: number; // 1 to 10
  feedback?: string;
  betterAnswer?: string;
  keyTakeaway?: string;
}

export interface BreakdownScores {
  communication: number; // 1-10
  technicalKnowledge: number; // 1-10
  confidence: number; // 1-10
  problemSolving: number; // 1-10
  grammar: number; // 1-10
  professionalism: number; // 1-10
}

export interface RoadmapDay {
  day: number;
  title: string;
  focus: string;
  tasks: string[];
}

export interface InterviewReport {
  id: string;
  date: string; // ISO string or human formatted
  config: InterviewConfig;
  overallScore: number; // 1 to 100
  breakdown: BreakdownScores;
  strengths: string[];
  weaknesses: string[];
  professionalSummary: string;
  roadmap: RoadmapDay[];
  suggestedTopics: string[];
  recommendedQuestions: string[];
  qaList: QAItem[];
}

export type APIProvider = 'openai' | 'gemini';

export interface APIConfig {
  provider: APIProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface APIPreset {
  label: string;
  provider: APIProvider;
  baseUrl: string;
  model: string;
}

export const API_PRESETS: APIPreset[] = [
  { label: 'OpenAI', provider: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { label: 'Gemini', provider: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-2.0-flash' },
  { label: 'Groq', provider: 'openai', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  { label: 'OpenRouter', provider: 'openai', baseUrl: 'https://openrouter.ai/api/v1', model: 'inclusionai/ling-3.0-flash:free' },
  { label: 'Together', provider: 'openai', baseUrl: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
];

export const DEFAULT_API_CONFIG: APIConfig = {
  provider: 'openai',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  model: 'inclusionai/ling-3.0-flash:free',
};

export type PageView = 'home' | 'setup' | 'interview' | 'results' | 'history' | 'about';
