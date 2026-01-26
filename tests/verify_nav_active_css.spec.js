const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('verify active nav state styles', async ({ page }) => {
  const cssPath = path.join(__dirname, '../assets/main.scss');
  let cssContent = fs.readFileSync(cssPath, 'utf8');

  // Strip Front Matter
  cssContent = cssContent.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Extract the focus variable
  const focusColorMatch = cssContent.match(/\$focus-color:\s*(#[a-fA-F0-9]{3,6})/);
  const focusColor = focusColorMatch ? focusColorMatch[1] : '#82aaff';

  // Extract ONLY the relevant block to avoid SCSS syntax errors from other parts
  const activeNavBlock = cssContent.match(/\/\* Active Navigation State \*\/([\s\S]*?)(?=\/\*|$)/);
  cssContent = activeNavBlock ? activeNavBlock[0] : '';

  // Replace variable usage
  cssContent = cssContent.replace(/\$focus-color/g, focusColor);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; }
        .site-nav { background: #f0f0f0; padding: 20px; }
        .page-link { color: #333; text-decoration: none; margin-right: 20px; font-size: 18px; }

        /* Inject the processed SCSS */
        ${cssContent}
      </style>
    </head>
    <body>
      <nav class="site-nav">
        <a class="page-link" href="#">Home</a>
        <a class="page-link" href="#" aria-current="page">About (Active)</a>
        <a class="page-link" href="#">Contact</a>
      </nav>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const activeLink = page.locator('a[aria-current="page"]');
  const inactiveLink = page.locator('a:not([aria-current="page"])').first();

  // Check that the active link is visually distinct
  // We expect the color to match the focus color (#82aaff -> rgb(130, 170, 255))
  await expect(activeLink).toHaveCSS('color', 'rgb(130, 170, 255)');

  // We expect font-weight to be 600
  await expect(activeLink).toHaveCSS('font-weight', '600');

  // We expect underline
  // text-decoration-line property is reliable
  await expect(activeLink).toHaveCSS('text-decoration-line', 'underline');

  // Verify inactive link doesn't have these styles (basic check)
  await expect(inactiveLink).not.toHaveCSS('text-decoration-line', 'underline');

  // Screenshot for debugging (saved to test-results)
  try {
      await page.screenshot({ path: 'test-results/nav_active_state.png' });
  } catch (e) {
      // Ignore if directory doesn't exist or other error, as this is secondary
  }
});
