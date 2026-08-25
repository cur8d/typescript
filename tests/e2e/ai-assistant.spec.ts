import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("AI Assistant E2E & Accessibility", () => {
  test("should show floating Ask AI trigger on landing page", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open ai assistant/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText("Ask AI");
  });

  test("should open modal on clicking floating trigger and close on close button", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open ai assistant/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /ai assistant chat/i });
    await expect(dialog).toBeVisible();
    await expect(page.getByText("cur8d Copilot")).toBeVisible();

    const closeBtn = page.getByRole("button", { name: /close ai assistant/i });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test("should open modal on clicking navbar Ask AI button", async ({ page }) => {
    await page.goto("/");
    const navBtn = page.getByRole("button", { name: /open ai assistant/i }).first();
    await navBtn.click();

    const dialog = page.getByRole("dialog", { name: /ai assistant chat/i });
    await expect(dialog).toBeVisible();
  });

  test("should toggle modal on pressing keyboard shortcut and close on Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+j");

    const dialog = page.getByRole("dialog", { name: /ai assistant chat/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("AI assistant modal should pass axe-core accessibility audit", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open ai assistant/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /ai assistant chat/i });
    await expect(dialog).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
