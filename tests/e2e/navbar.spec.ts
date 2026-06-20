import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("should have a Docs link pointing to /typescript", async ({ page }) => {
    await page.goto("/");
    const docsLink = page.getByRole("link", { name: "Docs" });
    await expect(docsLink).toBeVisible();
    await expect(docsLink).toHaveAttribute("href", "/typescript");
  });
});
