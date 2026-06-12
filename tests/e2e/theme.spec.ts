import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("should toggle theme correctly", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByLabel("Toggle theme");
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(500);
    await toggle.click();
  });
});
