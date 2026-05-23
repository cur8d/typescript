import { test, expect } from "@playwright/test";

test.describe("Search Palette", () => {
  test("should open search palette via button click", async ({ page }) => {
    await page.goto("/");
    const searchButton = page.getByRole("button", { name: /Search.../i });
    await searchButton.click();
    const input = page.getByPlaceholder(/Type a command or search.../i);
    await expect(input).toBeVisible();
    await input.fill("Dashboard");
    await expect(page.getByRole("option", { name: "Dashboard" })).toBeVisible();
  });
});
