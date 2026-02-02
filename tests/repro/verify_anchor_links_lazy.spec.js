const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links are lazily loaded', async ({ page }) => {
  const scriptPath = path.join(__dirname, '../../assets/js/anchor-links.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Create a page with many headers
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; padding: 20px; font-family: sans-serif; }
        .spacer { height: 2000px; background: #eee; border: 1px dashed #ccc; margin: 20px 0; }
        h2 { padding: 10px; background: #eef; border-left: 5px solid #007bff; }
        .anchor-link {
          margin-left: 10px;
          padding: 2px 6px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h2 id="header-1">Header 1 (Top)</h2>
        <div class="spacer">Spacer</div>
        <h2 id="header-2">Header 2 (Bottom)</h2>
      </div>
      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Screenshot top
  await page.screenshot({ path: 'verification/before_scroll.png' });

  // Check header-1 (visible) has anchor
  const anchor1 = page.locator('#header-1 .anchor-link');
  await expect(anchor1).toHaveCount(1);

  // Check header-2 (not visible) does NOT have anchor initially
  const anchor2 = page.locator('#header-2 .anchor-link');
  await expect(anchor2).toHaveCount(0);

  // Scroll to header-2
  await page.locator('#header-2').scrollIntoViewIfNeeded();

  // Check header-2 has anchor after scroll
  await expect(anchor2).toHaveCount(1);

  // Screenshot bottom
  await page.screenshot({ path: 'verification/after_scroll.png' });
});
