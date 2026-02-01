const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links should be lazy loaded', async ({ page }) => {
  const scriptPath = path.join(__dirname, '../../assets/js/anchor-links.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; height: 3000px; }
        .spacer { height: 1500px; background: #eee; border: 1px solid #ccc; }
        h2 { margin: 20px 0; padding: 10px; }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h2 id="top-header">Top Header</h2>
        <div class="spacer">Spacer to push content down</div>
        <h2 id="bottom-header">Bottom Header</h2>
      </div>
      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `);

  // Allow some time for the script to run and potential initial DOM manipulation
  await page.waitForTimeout(500);

  // Check Top Header (should have anchor because it is in viewport)
  const topAnchor = page.locator('#top-header .anchor-link');
  await expect(topAnchor).toHaveCount(1);

  // Check Bottom Header (should NOT have anchor initially because it is out of viewport)
  const bottomAnchor = page.locator('#bottom-header .anchor-link');
  // Currently this will FAIL because code adds to all headers immediately
  await expect(bottomAnchor).toHaveCount(0);

  // Scroll to bottom to trigger IntersectionObserver
  await page.locator('#bottom-header').scrollIntoViewIfNeeded();

  // Wait a bit for observer to fire
  await page.waitForTimeout(500);

  // Check Bottom Header again (should now have anchor)
  await expect(bottomAnchor).toHaveCount(1);
});
