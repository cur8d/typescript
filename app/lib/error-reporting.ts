const SENSITIVE_KEYS = ["token", "password", "secret", "key", "authorization", "cookie", "credential", "apikey"];

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sk => lowerKey.includes(sk));
}

function sanitizeError(value: Error, seen: WeakSet<object>): Error {
  const err = new Error(sanitize(value.message, seen) as string);
  err.name = value.name;
  if (value.stack) err.stack = sanitize(value.stack, seen) as string;
  const valueObj = value as unknown as Record<string, unknown>;
  const errObj = err as unknown as Record<string, unknown>;
  for (const key of Object.getOwnPropertyNames(value)) {
    if (key !== "message" && key !== "stack" && key !== "name") {
      errObj[key] = isSensitiveKey(key) ? "[REDACTED]" : sanitize(valueObj[key], seen);
    }
  }
  return err;
}

function sanitizeObject(value: object, seen: WeakSet<object>): Record<string, unknown> {
  const res: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    res[k] = isSensitiveKey(k) ? "[REDACTED]" : sanitize(v, seen);
  }
  return res;
}

export function sanitize(value: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof value === "string") {
    return value.replace(/vercel_blob_rw_[a-z0-9_-]+/gi, "[REDACTED_VERCEL_BLOB_TOKEN]");
  }
  if (!value || typeof value !== "object") return value;
  if (value instanceof Date || value instanceof RegExp) return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (value instanceof Error) {
    return sanitizeError(value, seen);
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitize(item, seen));
  }

  return sanitizeObject(value, seen);
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
  const sanitizedContext = context ? sanitize(context) as Record<string, unknown> : undefined;

  if (sanitizedContext) {
    console.error(sanitizedError, sanitizedContext);
  } else {
    console.error(sanitizedError);
  }
}
