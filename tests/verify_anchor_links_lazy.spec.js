const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links are added lazily', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/anchor-links.js'), 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .anchor-link { opacity: 0; transition: opacity 0.2s; margin-left: 0.5rem; }
        h2:hover .anchor-link, h3:hover .anchor-link { opacity: 1; }
        body { margin: 0; }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h2 id="section-1">Section 1</h2>
        <div style="height: 3000px">Spacer</div>
        <h2 id="section-3">Section 3</h2>
      </div>
      <script>${scriptContent}</script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Section 1 should have it immediately (it's in view)
  const anchor1 = page.locator('#section-1 .anchor-link');
  await expect(anchor1).toHaveCount(1);
  await expect(anchor1).toHaveText('#');

  // Section 3 is far down, so it should NOT have it yet
  const anchor3 = page.locator('#section-3 .anchor-link');
  await expect(anchor3).toHaveCount(0);

  // Now scroll to the bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for observer to trigger
  await expect(anchor3).toHaveCount(1);
});
