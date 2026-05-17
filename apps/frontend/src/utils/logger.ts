// Lightweight centralized logger for frontend. Allows replacing implementation later.
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levelOrder: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

const envLevel = (typeof process !== 'undefined' && (process.env as any)?.LOG_LEVEL) || ((typeof import.meta !== 'undefined') ? (import.meta as any).env?.VITE_LOG_LEVEL : undefined);
const CURRENT_LEVEL: LogLevel = (envLevel || 'info') as LogLevel;

function shouldLog(level: LogLevel) {
  return levelOrder[level] <= levelOrder[CURRENT_LEVEL];
}

const logger = {
  error: (...args: any[]) => { if (shouldLog('error')) console.error(...args); },
  warn: (...args: any[]) => { if (shouldLog('warn')) console.warn(...args); },
  info: (...args: any[]) => { if (shouldLog('info')) console.info(...args); },
  debug: (...args: any[]) => { if (shouldLog('debug')) console.debug(...args); },
};

export default logger;
