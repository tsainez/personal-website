// tests/verify_anchor_links_lazy.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links should be created lazily', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

  // Create a page with enough content to scroll
  // We use a large spacer to ensure the bottom header is off-screen
  await page.setContent(`
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; }
          .spacer { height: 2000px; } /* Ensure clearly off-screen */
          h2 { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="page-content">
          <h2 id="top-header">Top Header</h2>
          <div class="spacer"></div>
          <h2 id="bottom-header">Bottom Header</h2>
        </div>
        <script>
          ${scriptContent}
        </script>
      </body>
    </html>
  `);

  // Wait for initial execution
  await page.waitForTimeout(500);

  // Check top header has anchor (it should be visible or close enough)
  const topAnchor = page.locator('#top-header .anchor-link');
  await expect(topAnchor).toHaveCount(1);

  // Check bottom header - it SHOULD NOT exist yet because it's far down (2000px spacer)
  // This verifies the lazy loading behavior
  const bottomAnchor = page.locator('#bottom-header .anchor-link');
  await expect(bottomAnchor).toHaveCount(0);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait a bit for observer to fire
  await page.waitForTimeout(500);

  // Check bottom header - NOW it should exist
  await expect(bottomAnchor).toHaveCount(1);
});
