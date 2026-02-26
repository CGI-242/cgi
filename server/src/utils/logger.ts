// server/src/utils/logger.ts
// Logger léger compatible avec createLogger de cgi-engine (remplace Winston)

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    return `${timestamp} ${level} ${ctx} ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(this.format('DEBUG', message), data !== undefined ? data : '');
    }
  }

  info(message: string, data?: unknown): void {
    console.log(this.format('INFO', message), data !== undefined ? data : '');
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.format('WARN', message), data !== undefined ? data : '');
  }

  error(message: string, data?: unknown): void {
    console.error(this.format('ERROR', message), data !== undefined ? data : '');
  }

  child(context: string): Logger {
    const childContext = this.context ? `${this.context}:${context}` : context;
    return new Logger(childContext);
  }
}

export const logger = new Logger();

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export default logger;
