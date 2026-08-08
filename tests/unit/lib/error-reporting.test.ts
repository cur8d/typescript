import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reportError, sanitize } from "@/lib/error-reporting";

describe("error-reporting utility", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs error to console", () => {
    const error = new Error("Test error");
    reportError(error);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    const loggedError = vi.mocked(console.error).mock.calls[0][0] as Error;
    expect(loggedError.message).toBe("Test error");
  });

  it("logs error with context to console", () => {
    const error = new Error("Test error");
    const context = { foo: "bar" };
    reportError(error, context);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error), context);
    const loggedError = vi.mocked(console.error).mock.calls[0][0] as Error;
    expect(loggedError.message).toBe("Test error");
  });

  describe("sanitize", () => {
    it("should redact Vercel Blob tokens from strings", () => {
      const sensitiveStr = "Error uploading to vercel_blob_rw_12345abcdef! Please check key.";
      expect(sanitize(sensitiveStr)).toBe("Error uploading to [REDACTED_VERCEL_BLOB_TOKEN]! Please check key.");
    });

    it("should recursively redact sensitive object properties", () => {
      const payload = {
        user: "john_doe",
        apiKey: "secret_key_123",
        nested: {
          password: "my-password",
          token: "vercel_blob_rw_xyz123",
          ok: true,
        },
      };

      expect(sanitize(payload)).toEqual({
        user: "john_doe",
        apiKey: "[REDACTED]",
        nested: {
          password: "[REDACTED]",
          token: "[REDACTED]",
          ok: true,
        },
      });
    });

    it("should sanitize Error objects and their properties", () => {
      const error = new Error("Failed with vercel_blob_rw_abc");
      error.stack = "Error at line 1 with vercel_blob_rw_abc";
      const errorObj = error as unknown as Record<string, unknown>;
      errorObj.secretInfo = "my-secret";
      errorObj.safeField = "safe";

      const sanitized = sanitize(error) as Error;
      const sanitizedObj = sanitized as unknown as Record<string, unknown>;
      expect(sanitized.message).toBe("Failed with [REDACTED_VERCEL_BLOB_TOKEN]");
      expect(sanitized.stack).toBe("Error at line 1 with [REDACTED_VERCEL_BLOB_TOKEN]");
      expect(sanitizedObj.secretInfo).toBe("[REDACTED]");
      expect(sanitizedObj.safeField).toBe("safe");
    });

    it("should handle circular references without stack overflow", () => {
      const circular: Record<string, unknown> = { name: "circular" };
      circular.self = circular;

      expect(() => sanitize(circular)).not.toThrow();
      const sanitized = sanitize(circular) as Record<string, unknown>;
      expect(sanitized.name).toBe("circular");
      expect(sanitized.self).toBe("[Circular]");
    });

    it("should handle built-in objects like Date and RegExp directly", () => {
      const date = new Date("2025-05-23T00:00:00.000Z");
      const regex = /abc/gi;
      const payload = {
        timestamp: date,
        pattern: regex,
      };

      const sanitized = sanitize(payload) as Record<string, unknown>;
      expect(sanitized.timestamp).toBe(date);
      expect(sanitized.pattern).toBe(regex);
    });
  });
});
