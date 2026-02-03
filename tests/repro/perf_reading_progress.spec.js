const { test, expect } = require('@playwright/test');
const path = require('path');

test('reading progress bar does not thrash layout on scroll', async ({ page }) => {
  // Navigate to the local file
  const fileUrl = 'file://' + path.resolve(__dirname, 'repro_reading_progress.html');
  await page.goto(fileUrl);

  // Inject spy on document.documentElement.scrollHeight and clientHeight
  await page.evaluate(() => {
    window.layoutReads = 0;

    // We need to capture the original getters from Element.prototype
    const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    const originalClientHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');

    // Override specifically on document.documentElement
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: function() {
        window.layoutReads++;
        return originalScrollHeightDesc.get.call(this);
      }
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      get: function() {
        window.layoutReads++;
        return originalClientHeightDesc.get.call(this);
      }
    });
  });

  // Reset count (initial render might have read it, or not, as the script ran on load)
  // But the script adds the scroll listener.

  await page.evaluate(() => {
    window.layoutReads = 0;
  });

  // Scroll
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(500); // Wait for throttled events

  // Check count
  const reads = await page.evaluate(() => window.layoutReads);

  console.log(`Layout reads during scroll: ${reads}`);

  // The unoptimized code reads scrollHeight and clientHeight on every scroll frame (throttled).
  // So we expect this to be > 0.
  // The optimized code should be 0.
  expect(reads).toBe(0);
});
