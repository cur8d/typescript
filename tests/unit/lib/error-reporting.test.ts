import { describe, it, expect, vi, beforeEach } from "vitest";
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
});
