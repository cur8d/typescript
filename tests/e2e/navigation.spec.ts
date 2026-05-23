import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/Blueprint/i);

    const dashboardLink = page.locator('a[href="/dashboard"]').first();
    await dashboardLink.click();
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("h1")).toContainText(/Dashboard/i);

    const aboutLink = page.locator('a[href="/about"]').first();
    await aboutLink.click();
    await expect(page).toHaveURL("/about");
    await expect(page.locator("h1")).toContainText(/About/i);
  });
});
