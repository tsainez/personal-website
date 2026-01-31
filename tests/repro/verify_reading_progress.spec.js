const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('reading progress bar updates on scroll', async ({ page }) => {
  const jsContent = fs.readFileSync(path.join(__dirname, '../../assets/js/reading-progress.js'), 'utf8');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; padding: 0; }
        #reading-progress {
          position: fixed; top: 0; left: 0; height: 4px; background: red; width: 0;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <h1>Long Content</h1>
      <script>${jsContent}</script>
    </body>
    </html>
  `;

  await page.setContent(html);
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
