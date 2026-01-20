const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Anchor links use SVG icon', async ({ page }) => {
  const jsContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Mock styles */
          .post-content h2 { font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="post-content">
          <h2 id="section-title">Section Title</h2>
        </div>
        <script>
          ${jsContent}
          // Manually dispatch DOMContentLoaded in case the script missed it
          if (document.readyState !== 'loading') {
            document.dispatchEvent(new Event('DOMContentLoaded'));
          }
        </script>
      </body>
    </html>
  `);

  const anchor = page.locator('.anchor-link');
  await expect(anchor).toBeVisible();

  // Verify accessibility
  await expect(anchor).toHaveAttribute('aria-label', 'Copy link to section');

  // Verify it has SVG
  const svg = anchor.locator('svg');
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute('aria-hidden', 'true');

  // Verify it does NOT show '#' text
  // .innerText() returns visible text.
  const text = await anchor.innerText();
  expect(text.trim()).toBe('');
});
