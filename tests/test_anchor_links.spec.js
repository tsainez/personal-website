const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor-links copies correct URL to clipboard', async ({ page }) => {
  // 1. Setup mock page with headers and clipboard mock
  // We need to overwrite navigator.clipboard if it exists, or define it.
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <div class="post-content">
        <h2 id="section-1">Section 1</h2>
        <h3 id="section-2">Section 2</h3>
      </div>
    </body>
    </html>
  `);

  // Mock clipboard in the page context
  await page.evaluate(() => {
    // Basic mock for writeText
    const mockClipboard = {
      writeText: async (text) => {
        window.__mockClipboardText = text;
      }
    };

    // Try to overwrite or define
    try {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      });
    } catch (e) {
      // Fallback if defineProperty fails (though usually works in playwright)
      navigator.clipboard = mockClipboard;
    }
  });

  // 2. Inject the script
  const jsContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');
  await page.addScriptTag({ content: jsContent });

  // 3. Dispatch DOMContentLoaded manually
  await page.evaluate(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  // 4. Verify buttons were added
  const buttons = page.locator('.anchor-link');
  await expect(buttons).toHaveCount(2);

  // 5. Click the first button
  await buttons.first().click();

  // 6. Verify clipboard content
  const clipboardContent = await page.evaluate(() => window.__mockClipboardText);
  // URL should end with #section-1
  expect(clipboardContent).toMatch(/#section-1$/);

  // 7. Verify visual feedback class
  await expect(buttons.first()).toHaveClass(/copied/);
});
