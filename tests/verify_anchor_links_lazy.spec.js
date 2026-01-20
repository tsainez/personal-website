const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('anchor links should be lazy loaded', async ({ page }) => {
  // Inject HTML structure
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            .post-content { max-width: 800px; margin: 0 auto; }
            h2 { margin-top: 50px; }
            .spacer { height: 200vh; background: #f0f0f0; border: 1px dashed #ccc; margin: 20px 0; }
            .anchor-link { margin-left: 10px; cursor: pointer; }
        </style>
    </head>
    <body>
      <div class="post-content">
          <h2 id="top-header">Top Header</h2>
          <div class="spacer">Spacer to force scroll</div>
          <h2 id="bottom-header">Bottom Header</h2>
      </div>
    </body>
    </html>
  `);

  // Inject Script
  const jsContent = fs.readFileSync('assets/js/anchor-links.js', 'utf8');
  await page.addScriptTag({ content: jsContent });

  // Dispatch DOMContentLoaded as the script waits for it
  // Since page.setContent triggers load, but addScriptTag happens after?
  // Playwright's addScriptTag might execute immediately.
  // The script waits for 'DOMContentLoaded'. If it already happened, it won't trigger.
  // So we manually check state or dispatch.
  await page.evaluate(() => {
    if (document.readyState === 'loading') {
      // Do nothing, it will fire
    } else {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
  });

  // Wait for observer to pick up top header
  await page.waitForTimeout(500);

  // Top header should have anchor
  const topHeader = page.locator('#top-header');
  await expect(topHeader.locator('.anchor-link')).toHaveCount(1);

  // Bottom header should NOT have an anchor yet
  const bottomHeader = page.locator('#bottom-header');
  expect(await bottomHeader.locator('.anchor-link').count()).toBe(0);

  // Scroll to bottom
  await bottomHeader.scrollIntoViewIfNeeded();

  // Wait for observer
  await page.waitForTimeout(500);

  // Now it should have an anchor
  await expect(bottomHeader.locator('.anchor-link')).toHaveCount(1);
});
