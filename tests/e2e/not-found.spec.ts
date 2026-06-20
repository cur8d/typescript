import { test, expect } from "@playwright/test";

test.describe("NotFound page E2E", () => {
  test("should display 404 page for non-existent route", async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto("/some-non-existent-page");

    // Check for 404 text
    await expect(
      page.getByRole("heading", { name: /404 - Page Not Found/i })
    ).toBeVisible();

    // Check for 'Return Home' link
    const returnHomeLink = page.getByRole("link", { name: /return home/i });
    await expect(returnHomeLink).toBeVisible();
    await expect(returnHomeLink).toHaveAttribute("href", "/");

    // Click 'Return Home' and verify navigation
    await returnHomeLink.click();
    await expect(page).toHaveURL("/");
  });
});
