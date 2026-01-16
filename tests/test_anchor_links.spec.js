const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

test.describe('Anchor Links', () => {
  test('should add anchor links to headers and copy URL on click', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Mock navigator.clipboard
    await page.evaluate(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: async (text) => {
            window.__mockClipboard = text;
            return Promise.resolve();
          },
          readText: async () => {
            return Promise.resolve(window.__mockClipboard || '');
          }
        }
      });
    });

    // Setup a dummy page with headers
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div class="post-content">
          <h2 id="section-1">Section 1</h2>
          <h3 id="section-2">Section 2</h3>
          <h4>No ID here</h4>
        </div>
        <div class="page-content">
          <h2 id="page-section">Page Section</h2>
        </div>
      </body>
      </html>
    `);

    // Inject the script
    await page.addScriptTag({ content: scriptContent });

    // Wait for the script to run (it runs on DOMContentLoaded, but since we inject it after content is set,
    // we might need to trigger it or wrap it.
    // The script does: document.addEventListener('DOMContentLoaded', ...)
    // If DOMContentLoaded already fired, it won't run.

    // We can dispatch the event manually.
    await page.evaluate(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    // Verify anchor links are added
    const anchors = page.locator('.anchor-link');
    await expect(anchors).toHaveCount(3); // section-1, section-2, page-section. "No ID here" should be skipped.

    // Test clicking the first anchor
    const firstAnchor = anchors.first();
    await firstAnchor.click();

    // Verify visual feedback
    await expect(firstAnchor).toHaveClass(/copied/);
    await expect(firstAnchor).toHaveAttribute('aria-label', 'Link copied');

    // Verify clipboard content
    // Note: In some headless environments clipboard might be flaky, but let's try.
    // If strict read is not allowed, we can mock navigator.clipboard in a separate test or fallback.
    // But let's assume Playwright's permission grant works.
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    // The URL will be about:blank#section-1 or similar since we used setContent
    expect(clipboardText).toContain('#section-1');
  });
});
