const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('verify anchor link accessibility', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body>
      <div class="post-content">
        <h2 id="my-header">My Header</h2>
      </div>
      <script>
        // Mock clipboard API
        // We need to be careful as navigator.clipboard might be read-only in some envs
        try {
            if (!navigator.clipboard) {
                // If it doesn't exist, we can try to define it
                Object.defineProperty(navigator, 'clipboard', {
                    value: {
                        writeText: async (text) => { return Promise.resolve(); }
                    },
                    configurable: true,
                    writable: true
                });
            } else {
                // If it exists, try to override writeText
                 Object.defineProperty(navigator.clipboard, 'writeText', {
                    value: async (text) => { return Promise.resolve(); },
                    configurable: true,
                    writable: true
                });
            }
        } catch (e) {
            console.error('Failed to mock clipboard:', e);
        }
      </script>
      <script>${scriptContent}</script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const anchor = page.locator('#my-header .anchor-link');

  // 1. Check for specific label
  await expect(anchor).toHaveAttribute('aria-label', 'Copy link to section: My Header');

  // 2. Click and check feedback
  await anchor.click();

  await expect(anchor).toHaveAttribute('aria-label', 'Link copied');
  await expect(anchor).toHaveClass(/copied/);

  // 3. Wait for timeout and check reset
  // The script uses 2000ms timeout
  await page.waitForTimeout(2100);

  await expect(anchor).toHaveAttribute('aria-label', 'Copy link to section: My Header');
  await expect(anchor).not.toHaveClass(/copied/);
});
