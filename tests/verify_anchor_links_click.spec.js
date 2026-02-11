const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links copy to clipboard on click', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .anchor-link { opacity: 1; margin-left: 0.5rem; }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h2 id="section-1">
          Section 1
          <a class="anchor-link" href="#section-1" aria-label="Link to section">#</a>
        </h2>
      </div>
      <script>
        // Mock clipboard because headless browser permissions can be tricky
        window.clipboardData = null;
        // Override navigator.clipboard for testing
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: async (text) => {
              window.clipboardData = text;
            }
          },
          writable: true
        });
      </script>
      <script>${scriptContent}</script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const anchor = page.locator('.anchor-link').first();

  // Click the anchor link
  await anchor.click();

  // Verify visual feedback (class added)
  await expect(anchor).toHaveClass(/copied/);

  // Verify aria-label update
  await expect(anchor).toHaveAttribute('aria-label', 'Link copied');

  // Verify clipboard content
  const clipboardText = await page.evaluate(() => window.clipboardData);

  // The URL should end with the hash
  expect(clipboardText).toBeTruthy();
  expect(clipboardText).toContain('#section-1');
});
