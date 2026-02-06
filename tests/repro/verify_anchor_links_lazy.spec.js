const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Anchor links should be lazy loaded', async ({ page }) => {
  // Read the anchor-links.js script
  const scriptContent = fs.readFileSync(path.join(__dirname, '../../assets/js/anchor-links.js'), 'utf8');

  // Generate HTML with enough content to force scrolling
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lazy Load Anchor Links Test</title>
      <style>
        body { font-family: sans-serif; }
        .post-content { max-width: 800px; margin: 0 auto; }
        h2 { margin-top: 500px; padding: 20px; border: 1px solid #ccc; }
        /* Basic styling for the anchor link from main.scss (mocked) */
        .anchor-link {
          margin-left: 10px;
          opacity: 1; /* Force visible for test */
          border: 1px solid red; /* Make it obvious */
          width: 20px;
          height: 20px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="post-content">
        <h1>Title</h1>
  `;

  // Add 50 headers
  for (let i = 1; i <= 50; i++) {
    htmlContent += `<h2 id="header-${i}">Header ${i}</h2>\n`;
  }

  htmlContent += `
      </div>
      <!-- Inject the script -->
      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // 1. Verify the first header has the anchor link immediately
  const firstHeaderAnchor = page.locator('#header-1 .anchor-link');
  await expect(firstHeaderAnchor).toHaveCount(1);

  // 2. Verify a header far down the page (e.g., #40) does NOT have the anchor link initially
  // Note: Current implementation loads ALL, so this expectation will FAIL before optimization.
  const lastHeaderAnchor = page.locator('#header-50 .anchor-link');
  await expect(lastHeaderAnchor).toHaveCount(0, { timeout: 2000 }); // Short timeout as we expect it to be 0 immediately

  // 3. Scroll to the last header
  const lastHeader = page.locator('#header-50');
  await lastHeader.scrollIntoViewIfNeeded();

  // 4. Verify the anchor link appears after scrolling
  await expect(lastHeaderAnchor).toHaveCount(1);
});
