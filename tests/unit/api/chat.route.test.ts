import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/api/chat/route";
import * as errorReporting from "@/lib/error-reporting";

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a 200 SSE stream for valid messages", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            id: "msg_1",
            role: "user",
            parts: [{ type: "text", text: "Hello AI" }],
          },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");
  });

  it("should normalize messages with string content and handle missing id/role", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Tell me about cur8d" }, // without id
          { id: "custom_id", content: "Without role" }, // without role (defaults to user)
          { role: "assistant", parts: [{ type: "text", text: "Existing parts" }] }, // with parts
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");
  });

  it("should handle provider and model overrides", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "mock",
        model: "mock-custom-model",
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("should return 400 if messages is missing or not an array", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("Missing or invalid 'messages'");
  });

  it("should catch errors, report them, and return 500 when request body contains invalid message structure", async () => {
    const reportErrorSpy = vi.spyOn(errorReporting, "reportError");

    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [12345], // primitive value that fails convertToModelMessages
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(reportErrorSpy).toHaveBeenCalled();

    const json = await res.json();
    expect(json.error).toBe("Failed to process chat request");
  });

  it("should catch JSON parse errors, report them, and return 500", async () => {
    const reportErrorSpy = vi.spyOn(errorReporting, "reportError");

    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid-json",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(reportErrorSpy).toHaveBeenCalled();

    const json = await res.json();
    expect(json.error).toBe("Failed to process chat request");
  });

  it("should format unknown error when non-Error exception occurs", async () => {
    const reportErrorSpy = vi.spyOn(errorReporting, "reportError");

    const fakeReq = {
      json: () => Promise.reject("string error reason"),
    } as unknown as Request;

    const res = await POST(fakeReq);
    expect(res.status).toBe(500);
    expect(reportErrorSpy).toHaveBeenCalled();

    const json = await res.json();
    expect(json.message).toBe("Unknown error");
  });
});
