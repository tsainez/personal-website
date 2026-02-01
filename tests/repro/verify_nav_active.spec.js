const { test, expect } = require('@playwright/test');

test('verify active navigation link styling', async ({ page }) => {
  // Mock the HTML structure based on _includes/header.html
  // and the CSS based on what I plan to add to assets/main.scss
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Test Page</title>
      <style>
        /* Mock variables */
        :root {
          --focus-color: #82aaff;
        }

        /* Mock Minima base styles for context */
        .site-nav {
            float: right;
            line-height: 56px;
        }
        .site-nav .page-link {
            color: #111;
            line-height: 1.5;
            display: inline-block;
            margin-left: 20px;
        }

        /* The New CSS I plan to add */
        .site-nav .page-link[aria-current="page"] {
          font-weight: bold;
          text-decoration: underline;
          text-decoration-color: var(--focus-color);
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }
      </style>
    </head>
    <body>
      <header class="site-header">
        <div class="wrapper">
          <nav class="site-nav">
            <div class="trigger">
              <a class="page-link" href="/about/">About</a>
              <!-- The active link -->
              <a class="page-link" href="/portfolio/" aria-current="page">Portfolio</a>
              <a class="page-link" href="/contact/">Contact</a>
            </div>
          </nav>
        </div>
      </header>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Verify the active link styling
  const activeLink = page.locator('a[aria-current="page"]');

  // Check font-weight
  await expect(activeLink).toHaveCSS('font-weight', '700');

  // Check text-decoration
  await expect(activeLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(activeLink).toHaveCSS('text-decoration-color', 'rgb(130, 170, 255)'); // #82aaff

  // Take screenshot
  await page.screenshot({ path: 'verification_screenshot.png' });
});
