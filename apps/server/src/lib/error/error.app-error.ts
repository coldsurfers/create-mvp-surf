import type { errorCodeSchema } from '@/lib/error/error.code.types';
import type { z } from 'zod';

type ErrorCode = z.infer<typeof errorCodeSchema>;
type StatusCode = 200 | 400 | 401 | 404 | 500;

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: StatusCode;
  constructor({
    code,
    message,
    statusCode,
  }: { code: ErrorCode; message?: string; statusCode: StatusCode }) {
    super(message ?? code);
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
