import { InterviewReport, APIConfig, DEFAULT_API_CONFIG } from '../types';

const STORAGE_KEY = 'interviewace_history';
const THEME_KEY = 'interviewace_theme';
const API_CONFIG_KEY = 'interviewace_api_config';

export function getHistory(): InterviewReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load history from localStorage:', err);
    return [];
  }
}

export function saveReportToHistory(report: InterviewReport): void {
  try {
    const current = getHistory();
    // Prevent duplicate entries by ID
    const filtered = current.filter((item) => item.id !== report.id);
    const updated = [report, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save report to history:', err);
  }
}

export function deleteReportFromHistory(id: string): InterviewReport[] {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete report from history:', err);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function getStoredTheme(): boolean {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (err) {
    return false;
  }
}

export function setStoredTheme(isDark: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch (err) {
    console.error('Failed to store theme preference:', err);
  }
}

export function getAPIConfig(): APIConfig {
  try {
    const raw = localStorage.getItem(API_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_API_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_API_CONFIG, ...parsed };
  } catch (err) {
    console.error('Failed to load API config:', err);
    return { ...DEFAULT_API_CONFIG };
  }
}

export function saveAPIConfig(config: APIConfig): void {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save API config:', err);
  }
}
