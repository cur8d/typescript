import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should display KPI cards and data table", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Total Revenue")).toBeVisible();
    await expect(page.getByText("Sales")).toBeVisible();
    await expect(page.locator("table")).toBeVisible();
    await expect(page.getByText("Name")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
  });
});
