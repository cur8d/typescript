const SENSITIVE_KEY_PATTERN = /(?:password|secret|token|key|auth|cred)/i;
const VERCEL_BLOB_TOKEN_PATTERN = /vercel_blob_rw_[a-zA-Z0-9_-]+/g;

function sanitizeString(data: string): string {
  // Performance optimization: Fast-path check using includes() to avoid
  // expensive regex execution on strings that do not contain Vercel Blob tokens.
  return data.includes("vercel_blob_rw_")
    ? data.replace(VERCEL_BLOB_TOKEN_PATTERN, "[REDACTED_VERCEL_BLOB_TOKEN]")
    : data;
}

function sanitizeError(data: Error, seen: WeakSet<object>): Error {
  const sanitizedMsg = sanitize(data.message, seen) as string;
  const sanitizedStack = data.stack ? (sanitize(data.stack, seen) as string) : undefined;

  if (sanitizedMsg === data.message && sanitizedStack === data.stack) {
    return data;
  }

  const sanitizedError = new Error(sanitizedMsg);
  sanitizedError.name = data.name;
  if (sanitizedStack) {
    sanitizedError.stack = sanitizedStack;
  }
  return sanitizedError;
}

function sanitizeObject(data: Record<string, unknown>, seen: WeakSet<object>): Record<string, unknown> {
  const sanitizedObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitizedObj[key] = SENSITIVE_KEY_PATTERN.test(key) ? "[REDACTED]" : sanitize(value, seen);
  }
  return sanitizedObj;
}

function sanitize(data: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof data === "string") return sanitizeString(data);
  if (data === null || typeof data !== "object") return data;
  if (data instanceof Date || data instanceof RegExp) return data;
  if (seen.has(data)) return "[CIRCULAR]";
  seen.add(data);

  if (data instanceof Error) {
    return sanitizeError(data, seen);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, seen));
  }

  return sanitizeObject(data as Record<string, unknown>, seen);
}

/**
 * Reports an error to an error reporting service.
 * Currently logs to the console, but can be updated to use services like Sentry or Axiom.
 *
 * @param error - The error to report
 * @param context - Additional context information for the error
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  const sanitizedError = sanitize(error);
  const sanitizedContext = context ? (sanitize(context) as Record<string, unknown>) : undefined;

  if (sanitizedContext) {
    console.error(sanitizedError, sanitizedContext);
  } else {
    console.error(sanitizedError);
  }
}
