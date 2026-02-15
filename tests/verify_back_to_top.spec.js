// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Verify Back to Top button functionality', async ({ page }) => {
  // 1. Read necessary assets
  const cssPath = path.join(__dirname, '../_site/assets/main.css');
  const jsPath = path.join(__dirname, '../assets/js/back-to-top.js');

  if (!fs.existsSync(cssPath)) {
    throw new Error(`CSS file not found at ${cssPath}. Did you run 'bundle exec jekyll build'?`);
  }

  const css = fs.readFileSync(cssPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  // 2. Setup the page
  // We simulate a long page to enable scrolling
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Back to Top Verification</title>
      <style>
        ${css}
        /* Ensure we have enough content to scroll */
        body { height: 3000px; }
        .content { padding: 20px; }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>Scroll down to see the button</h1>
        <p>Lorem ipsum dolor sit amet...</p>
      </div>

      <!-- Back to Top Button HTML -->
      <button id="back-to-top" class="back-to-top" aria-label="Back to top">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

      <!-- Inject the script -->
      <script>
        ${js}
      </script>
    </body>
    </html>
  `);

  const button = page.locator('#back-to-top');

  // 3. Verify initial state (hidden)
  await expect(button).not.toHaveClass(/visible/);
  // Also check computed style if needed, but class check is cleaner given the implementation

  // 4. Scroll down > 300px
  await page.evaluate(() => window.scrollTo(0, 350));
  // Wait for a frame or two for the scroll event/observer to fire
  await page.waitForTimeout(100);

  // 5. Verify button is visible
  await expect(button).toHaveClass(/visible/);

  // 6. Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);

  // 7. Verify button is hidden again
  await expect(button).not.toHaveClass(/visible/);

  // 8. Verify click functionality
  // Scroll down again
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(button).toHaveClass(/visible/);

  // Click the button
  await button.click();

  // Wait for scroll to complete (smooth behavior might take time)
  // We can check if scrollY becomes 0
  await page.waitForFunction(() => window.scrollY === 0);

  // Verify it's back to top
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBe(0);
});
