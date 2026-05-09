const { test, expect } = require('@playwright/test');

test('reading progress bar updates on scroll', async ({ page }) => {
  // Use local server
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');
  const progressBar = page.locator('#reading-progress');

  // Initial check
  await expect(progressBar).toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)'); // scaleX(0) computes to this

  // Scroll using mouse wheel to simulate user interaction
  await page.mouse.wheel(0, 2000);

  // Wait for RAF
  await page.waitForTimeout(500);

  // Get the style attribute
  const style = await progressBar.getAttribute('style');

  expect(style).toMatch(/transform: scaleX\(\d+(\.\d+)?\);/);
  expect(style).not.toBe('transform: scaleX(0);');

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event('scroll')); // Dispatch manually to be sure
  });

  await page.waitForTimeout(500);
  const styleEnd = await progressBar.getAttribute('style');
  expect(styleEnd).toMatch(/transform: scaleX\(1\);/);
});
