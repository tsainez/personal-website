const { test, expect } = require('@playwright/test');

test('reading progress bar updates on dynamic content resize', async ({ page }) => {
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Fix CSS to allow body to grow so ResizeObserver can detect changes
  await page.evaluate(() => {
    document.body.style.height = 'auto';
    document.body.style.minHeight = '5000px';
  });

  const progressBar = page.locator('#reading-progress');

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    // Dispatch scroll event just in case
    window.dispatchEvent(new Event('scroll'));
  });

  await page.waitForTimeout(500); // Wait for RAF

  // Verify 100%
  const styleStart = await progressBar.getAttribute('style');
  expect(styleStart).toMatch(/width: 100(\.\d+)?%;/);

  // Dynamically double the content height (make it huge to overcome min-height quirks)
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.style.height = '10000px';
    document.body.appendChild(spacer);
  });

  // Wait for Observer or Scroll (we will rely on Observer in the new code)
  await page.waitForTimeout(500);

  // In the NEW implementation (ResizeObserver), this should update immediately without scroll.
  const styleEnd = await progressBar.getAttribute('style');

  // Parse width
  const widthMatch = styleEnd.match(/width: (\d+(\.\d+)?)%;/);
  const widthVal = parseFloat(widthMatch[1]);

  // It should be around 50% now (since we doubled height but kept scroll pos)
  expect(widthVal).toBeLessThan(60);
  expect(widthVal).toBeGreaterThan(40);
});
