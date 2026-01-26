const { test, expect } = require('@playwright/test');

test('reading progress bar is hidden/inactive on mobile', async ({ page }) => {
  // Use mobile viewport
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');
  const progressBar = page.locator('#reading-progress');

  // Verify it is hidden (display: none or width 0)
  // Our implementation might just set width to 0% or maybe we should hide it.
  // The user asked to "disable" it.
  // I will check that width is 0 even after scroll.

  // Initial check
  await expect(progressBar).toHaveCSS('width', '0px');

  // Scroll
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(500);

  // Should still be 0px
  await expect(progressBar).toHaveCSS('width', '0px');

  // Now resize to desktop
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(500);

  // Trigger scroll to update
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(500);

  // Should now have width
  const style = await progressBar.getAttribute('style');
  expect(style).not.toBe('width: 0%;');
  expect(style).toMatch(/width: \d+(\.\d+)?%;/);
});
