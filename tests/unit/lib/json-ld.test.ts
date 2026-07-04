import { describe, it, expect } from "vitest";
import { safeJsonLdStringify } from "@/lib/json-ld";

describe("safeJsonLdStringify", () => {
  it("should stringify a simple object", () => {
    const data = { name: "Test", age: 30 };
    expect(safeJsonLdStringify(data)).toBe('{"name":"Test","age":30}');
  });

  it("should escape '<' characters to '\\u003c'", () => {
    const data = { script: "<script>alert('xss')</script>" };
    const expected = '{"script":"\\u003cscript>alert(\'xss\')\\u003c/script>"}';
    expect(safeJsonLdStringify(data)).toBe(expected);
  });

  it("should escape multiple '<' characters", () => {
    const data = { text: "<<<" };
    const expected = '{"text":"\\u003c\\u003c\\u003c"}';
    expect(safeJsonLdStringify(data)).toBe(expected);
  });

  it("should handle nested objects and arrays", () => {
    const data = {
      items: [
        { id: 1, html: "<div>" },
        { id: 2, html: "<span>" },
      ],
    };
    const expected = '{"items":[{"id":1,"html":"\\u003cdiv>"},{"id":2,"html":"\\u003cspan>"}]}';
    expect(safeJsonLdStringify(data)).toBe(expected);
  });

  it("should return an empty string for undefined", () => {
    expect(safeJsonLdStringify(undefined)).toBe("");
  });

  it("should return 'null' for null", () => {
    expect(safeJsonLdStringify(null)).toBe("null");
  });
});
