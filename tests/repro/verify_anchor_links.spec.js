const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Anchor Links Verification', () => {
  let anchorLinksScript;

  test.beforeAll(async () => {
    // Read the script relative to this test file
    const scriptPath = path.resolve(__dirname, '../../assets/js/anchor-links.js');
    console.log(`Reading script from: ${scriptPath}`);
    anchorLinksScript = fs.readFileSync(scriptPath, 'utf8');
  });

  test('should verify anchor links behavior', async ({ page }) => {
    // Navigate to a blank page first to ensure clean state
    await page.goto('about:blank');

    // Set content with the script injected
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
        <style>
          .anchor-link {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: red;
          }
        </style>
      </head>
      <body>
        <div class="page-content">
          <h2 id="header-1">Header 1</h2>
        </div>
        <script>
          ${anchorLinksScript}
        </script>
      </body>
      </html>
    `);

    // Mock clipboard API
    await page.evaluate(() => {
      window.lastCopiedText = null;
      const mockClipboard = {
        writeText: async (text) => {
          window.lastCopiedText = text;
          console.log('Clipboard writeText called with:', text);
          return Promise.resolve();
        }
      };

      try {
        if (!navigator.clipboard) {
            navigator.clipboard = mockClipboard;
        } else {
            navigator.clipboard.writeText = mockClipboard.writeText;
        }
      } catch (e) {
        Object.defineProperty(navigator, 'clipboard', {
          value: mockClipboard,
          configurable: true,
          writable: true
        });
      }
    });

    // Locate the anchor link
    const anchorLink = page.locator('#header-1 .anchor-link');

    // Wait for it to be attached to DOM
    await expect(anchorLink).toBeAttached({ timeout: 5000 });

    // Verify it is an ANCHOR tag (updated behavior)
    const tagName = await anchorLink.evaluate(el => el.tagName.toLowerCase());
    console.log(`Initial tag name: ${tagName}`);

    expect(tagName).toBe('a');

    // Verify it has correct href
    const href = await anchorLink.getAttribute('href');
    expect(href).toBe('#header-1');

    // Click it
    await anchorLink.click();

    // Check for feedback class
    await expect(anchorLink).toHaveClass(/copied/);

    // Verify clipboard text
    const copiedText = await page.evaluate(() => window.lastCopiedText);
    console.log(`Copied text: ${copiedText}`);
    expect(copiedText).toContain('#header-1');
  });
});
