const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Anchor links should be generated and copy URL on click', async ({ page }) => {
  // Read the script content to inject it
  const scriptPath = path.join(__dirname, '../assets/js/anchor-links.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Set page content with the script injected
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .anchor-link { display: block; width: 20px; height: 20px; background: red; }
        .copied { background: green; }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h2 id="section-1">Section 1</h2>
      </div>
      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `);

  const anchorButton = page.locator('#section-1 .anchor-link');
  await expect(anchorButton).toBeVisible();

  // Mock clipboard API
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text) => {
          window.__clipboardContent = text;
        }
      },
      writable: true,
      configurable: true
    });
  });

  // Click the button
  await anchorButton.click();

  // Verify clipboard content
  const clipboardContent = await page.evaluate(() => window.__clipboardContent);
  expect(clipboardContent).toContain('#section-1');

  // Verify visual feedback (class 'copied' added)
  await expect(anchorButton).toHaveClass(/copied/);
});
