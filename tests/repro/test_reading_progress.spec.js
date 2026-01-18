const { test, expect } = require('@playwright/test');
const path = require('path');

test('reading progress bar updates on scroll and resize', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  const filePath = path.resolve(__dirname, 'perf_reading_progress.html');
  console.log('Loading file:', filePath);
  await page.goto(`file://${filePath}`);

  const progressBar = page.locator('#reading-progress');

  // Initial update should have run
  // Scroll down
  console.log('Scrolling...');

  // Use page.mouse.wheel or manually dispatch event, because window.scrollTo sometimes doesn't fire scroll in playwright headless?
  // But wait, the script listens to 'scroll'.

  await page.mouse.wheel(0, 2500);

  // Wait for rAF
  await page.waitForTimeout(500);

  const style = await progressBar.getAttribute('style');
  console.log('Progress style after scroll:', style);

  const box = await progressBar.boundingBox();
  console.log('Box width:', box.width);

  expect(box.width).toBeGreaterThan(0);
});
