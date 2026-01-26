const { test, expect } = require('@playwright/test');

test('reading progress bar minimizes scrollHeight accesses', async ({ page }) => {
  // Start spying on scrollHeight
  await page.addInitScript(() => {
    window._scrollHeightReads = 0;
    const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    Object.defineProperty(Element.prototype, 'scrollHeight', {
      get: function() {
        if (this === document.documentElement) {
            window._scrollHeightReads++;
        }
        return originalDescriptor.get.call(this);
      }
    });
  });

  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Reset counter after load
  await page.evaluate(() => window._scrollHeightReads = 0);

  // Scroll in steps to trigger multiple frames
  for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(50); // Wait enough for rAF to fire
  }

  await page.waitForTimeout(500);

  const reads = await page.evaluate(() => window._scrollHeightReads);
  console.log(`scrollHeight reads: ${reads}`);

  // In optimized version, this should be 0 because we cache it.
  // Unless a resize happened during scroll (unlikely in this test).
  expect(reads).toBe(0);
});
