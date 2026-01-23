const { test, expect } = require('@playwright/test');

test('reading progress bar updates on scroll', async ({ page }) => {
  // Use local server
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');
  const progressBar = page.locator('#reading-progress');

  // Initial check
  await expect(progressBar).toHaveCSS('width', '0px');

  // Scroll using mouse wheel to simulate user interaction
  await page.mouse.wheel(0, 2000);

  // Wait for RAF
  await page.waitForTimeout(500);

  // Get the style attribute
  const style = await progressBar.getAttribute('style');

  expect(style).toMatch(/width: \d+(\.\d+)?%;/);
  expect(style).not.toBe('width: 0%;');

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event('scroll')); // Dispatch manually to be sure
  });

  await page.waitForTimeout(500);
  const styleEnd = await progressBar.getAttribute('style');
  expect(styleEnd).toMatch(/width: 100(\.\d+)?%;/);
});

test('reading progress bar adapts to content resize', async ({ page }) => {
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');
  const progressBar = page.locator('#reading-progress');

  // Set initial height and scroll
  await page.evaluate(() => {
     document.body.style.height = '2000px';
     window.scrollTo(0, 500);
  });
  await page.waitForTimeout(500); // Wait for scroll and observer

  const style1 = await progressBar.getAttribute('style');
  const width1 = parseFloat(style1.match(/width: (\d+(\.\d+)?)%/)[1]);

  // Now make body much taller
  await page.evaluate(() => {
     document.body.style.height = '5000px';
  });
  // We do NOT dispatch scroll event. We rely on ResizeObserver.

  await page.waitForTimeout(500); // Wait for observer

  const style2 = await progressBar.getAttribute('style');
  const width2 = parseFloat(style2.match(/width: (\d+(\.\d+)?)%/)[1]);

  expect(width2).toBeLessThan(width1);
});
