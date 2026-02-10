const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('external links have icons and a11y text', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../assets/js/external-links.js'), 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
      <div class="post-content">
        <a href="https://example.com" id="external-link">External Link</a>
        <a href="/internal" id="internal-link">Internal Link</a>
        <a href="#section" id="anchor-link">Anchor Link</a>
      </div>
      <div class="page-content">
        <a href="http://insecure.com" id="http-link">HTTP Link</a>
      </div>
      <script>${scriptContent}</script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // External Link
  const extLink = page.locator('#external-link');
  await expect(extLink).toHaveClass(/external-link/);
  await expect(extLink).toHaveAttribute('target', '_blank');
  await expect(extLink).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(extLink.locator('.external-link-icon')).toBeVisible();
  await expect(extLink.locator('.sr-only')).toHaveText(/opens in a new tab/);

  // HTTP Link
  const httpLink = page.locator('#http-link');
  await expect(httpLink).toHaveClass(/external-link/);
  await expect(httpLink.locator('.external-link-icon')).toBeVisible();

  // Internal Link
  const intLink = page.locator('#internal-link');
  await expect(intLink).not.toHaveClass(/external-link/);
  await expect(intLink).not.toHaveAttribute('target', '_blank');
  await expect(intLink.locator('.external-link-icon')).toHaveCount(0);

  // Anchor Link
  const anchorLink = page.locator('#anchor-link');
  await expect(anchorLink).not.toHaveClass(/external-link/);
  await expect(anchorLink.locator('.external-link-icon')).toHaveCount(0);
});
