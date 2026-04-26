import { Request, Response, NextFunction } from 'express';
import { APP_CONFIG } from '../config/app.config';
import { MESSAGES } from '../config/messages.config';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;

  // Log error for observability (do not log in test environments if needed)
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${statusCode} - ${err.message}`);

  const isDev = !APP_CONFIG.isProduction;

  if (isDev) {
    res.status(statusCode).render('error', {
      title: MESSAGES.errors.genericTitle,
      statusCode,
      message: err.message,
      stack: err.stack || '',
    });
    return;
  }

  // Production: hide details
  const safeMessage =
    statusCode === 404
      ? MESSAGES.errors.notFoundMessage
      : MESSAGES.errors.unexpected;

  res.status(statusCode).render('error', {
    title: MESSAGES.errors.genericTitle,
    statusCode,
    message: safeMessage,
    stack: '',
  });
}

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error: AppError = new Error(MESSAGES.errors.notFoundMessage);
  error.statusCode = 404;
  next(error);
}
