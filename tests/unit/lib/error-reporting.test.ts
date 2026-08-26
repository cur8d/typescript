import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reportError } from "@/lib/error-reporting";

describe("error-reporting utility", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs error to console without context", () => {
    const error = new Error("Test error");
    reportError(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("logs error with context to console", () => {
    const error = new Error("Test error");
    const context = { foo: "bar" };
    reportError(error, context);
    expect(console.error).toHaveBeenCalledWith(error, context);
  });

  it("redacts sensitive keys in context object", () => {
    const error = new Error("Failed request");
    const context = {
      user: "alice",
      apiKey: "secret-key-123",
      password: "pAssword!12",
      authToken: "bearer-xyz",
      nested: {
        secretData: "hidden",
      },
    };

    reportError(error, context);

    expect(console.error).toHaveBeenCalledWith(error, {
      user: "alice",
      apiKey: "[REDACTED]",
      password: "[REDACTED]",
      authToken: "[REDACTED]",
      nested: {
        secretData: "[REDACTED]",
      },
    });
  });

  it("redacts Vercel Blob tokens in error messages and context strings", () => {
    const rawToken = "vercel_blob_rw_1234567890_abcdef";
    const error = new Error(`Connection failed using ${rawToken}`);
    error.stack = `Error: Connection failed using ${rawToken}\n at line 1`;
    const context = { details: `Failed to fetch from ${rawToken}` };

    reportError(error, context);

    const loggedError = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as Error;
    expect(loggedError.message).toBe("Connection failed using [REDACTED_VERCEL_BLOB_TOKEN]");
    expect(loggedError.stack).toContain("[REDACTED_VERCEL_BLOB_TOKEN]");
    expect(console.error).toHaveBeenCalledWith(
      expect.any(Error),
      { details: "Failed to fetch from [REDACTED_VERCEL_BLOB_TOKEN]" }
    );
  });

  it("handles error without stack properly when sanitizing", () => {
    const rawToken = "vercel_blob_rw_1234567890_abcdef";
    const error = new Error(`Connection failed using ${rawToken}`);
    delete error.stack;

    reportError(error);

    const loggedError = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as Error;
    expect(loggedError.message).toBe("Connection failed using [REDACTED_VERCEL_BLOB_TOKEN]");
    expect(loggedError.name).toBe("Error");
  });

  it("handles arrays and sanitizes nested elements", () => {
    const error = new Error("Array test");
    const context = {
      items: ["regular", "vercel_blob_rw_abc123_xyz", { secretKey: "123" }],
    };

    reportError(error, context);

    expect(console.error).toHaveBeenCalledWith(error, {
      items: ["regular", "[REDACTED_VERCEL_BLOB_TOKEN]", { secretKey: "[REDACTED]" }],
    });
  });

  it("handles circular references gracefully", () => {
    const error = new Error("Circular test");
    const circularObj: Record<string, unknown> = { name: "loop" };
    circularObj.self = circularObj;

    reportError(error, { payload: circularObj });

    expect(console.error).toHaveBeenCalledWith(error, {
      payload: {
        name: "loop",
        self: "[CIRCULAR]",
      },
    });
  });

  it("preserves Date, RegExp, and primitive values", () => {
    const date = new Date("2025-01-01T00:00:00Z");
    const regex = /test/g;
    const error = new Error("Types test");
    const context = {
      date,
      regex,
      count: 42,
      active: true,
      empty: null,
      missing: undefined,
    };

    reportError(error, context);

    expect(console.error).toHaveBeenCalledWith(error, {
      date,
      regex,
      count: 42,
      active: true,
      empty: null,
      missing: undefined,
    });
  });

  it("handles non-Error objects passed as error", () => {
    reportError("raw string error");
    expect(console.error).toHaveBeenCalledWith("raw string error");

    reportError(12345);
    expect(console.error).toHaveBeenCalledWith(12345);
  });
});
