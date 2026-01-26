const { test, expect } = require('@playwright/test');

test('reading progress bar updates when content size changes', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Fix repro to allow body to grow
  await page.evaluate(() => {
    document.body.style.height = 'auto';
    document.body.style.minHeight = '5000px';
  });

  const progressBar = page.locator('#reading-progress');

  // Scroll to 2500
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(500);

  const style1 = await progressBar.getAttribute('style');
  const width1 = parseFloat(style1.match(/width: (\d+(\.\d+)?)%/)[1]);
  console.log(`Initial width: ${width1}%`);

  // Increase content height
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.style.height = '5000px';
    div.style.background = 'red';
    document.body.appendChild(div);
  });

  // Wait for ResizeObserver
  await page.waitForTimeout(1000);

  const style2 = await progressBar.getAttribute('style');
  const width2 = parseFloat(style2.match(/width: (\d+(\.\d+)?)%/)[1]);
  console.log(`New width: ${width2}%`);

  expect(width2).toBeLessThan(width1);
});
