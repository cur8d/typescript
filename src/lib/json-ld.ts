/**
 * Safely stringifies an object for use in a JSON-LD <script> tag.
 * It escapes the '<' character to '\u003c' to prevent XSS attacks
 * where an attacker could close the script tag and inject malicious scripts.
 *
 * @param data The data to stringify
 * @returns A safe JSON string
 */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)?.replace(/</g, "\\u003c") ?? "";
}
