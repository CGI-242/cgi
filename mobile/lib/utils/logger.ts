// mobile/lib/utils/logger.ts
// Logger mobile : console en dev, Sentry en production

import { Sentry } from "@/lib/sentry";

class Logger {
  private context: string;

  constructor(context?: string) {
    this.context = context || "app";
  }

  warn(message: string, data?: unknown): void {
    if (__DEV__) {
      console.warn(`[${this.context}] ${message}`, data ?? "");
    } else {
      Sentry.addBreadcrumb({ category: this.context, message, level: "warning", data: data ? { detail: String(data) } : undefined });
    }
  }

  error(message: string, data?: unknown): void {
    if (__DEV__) {
      console.error(`[${this.context}] ${message}`, data ?? "");
    } else {
      Sentry.captureMessage(`[${this.context}] ${message}`, "error");
    }
  }

  info(message: string, data?: unknown): void {
    if (__DEV__) {
      console.log(`[${this.context}] ${message}`, data ?? "");
    }
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export const logger = new Logger();
export default logger;
