const SENSITIVE_KEY_PATTERN = /(?:password|secret|token|key|auth|cred)/i;
const VERCEL_BLOB_TOKEN_PATTERN = /vercel_blob_rw_[a-zA-Z0-9_-]+/g;

function sanitize(data: unknown, seen = new WeakSet()): unknown {
  if (typeof data === "string") {
    return data.replace(VERCEL_BLOB_TOKEN_PATTERN, "[REDACTED_VERCEL_BLOB_TOKEN]");
  }
  if (data === null || typeof data !== "object") return data;
  if (data instanceof Date || data instanceof RegExp) return data;
  if (seen.has(data)) return "[CIRCULAR]";
  seen.add(data);

  if (data instanceof Error) {
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

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, seen));
  }

  const sanitizedObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitizedObj[key] = "[REDACTED]";
    } else {
      sanitizedObj[key] = sanitize(value, seen);
    }
  }
  return sanitizedObj;
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
