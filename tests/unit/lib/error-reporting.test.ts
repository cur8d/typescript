import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reportError } from "@/lib/error-reporting";

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
    const context = { details: `Failed to fetch from ${rawToken}` };

    reportError(error, context);

    const loggedError = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as Error;
    expect(loggedError.message).toBe("Connection failed using [REDACTED_VERCEL_BLOB_TOKEN]");
    expect(console.error).toHaveBeenCalledWith(
      expect.any(Error),
      { details: "Failed to fetch from [REDACTED_VERCEL_BLOB_TOKEN]" }
    );
  });
});
