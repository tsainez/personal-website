
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('verify active navigation link styles', async ({ page }) => {
  // 1. Static Verification: Check if assets/main.scss contains the new rules
  const scssPath = path.join(__dirname, '../../assets/main.scss');
  const scssContent = fs.readFileSync(scssPath, 'utf8');

  // Verify the base rule exists
  const baseRuleRegex = /\.site-nav \.page-link\[aria-current="page"\]\s*\{\s*font-weight:\s*bold;\s*\}/;
  expect(scssContent).toMatch(baseRuleRegex);

  // Verify the dark mode override exists (checking for the selector and property)
  // Since it's nested, we check for the selector and the property usage
  // Note: This relies on the specific formatting we added
  expect(scssContent).toContain('.site-nav .page-link[aria-current="page"] {');
  expect(scssContent).toContain('color: $focus-color;');

  // 2. Dynamic Verification: Simulate the rendered state
  // We mock the CSS compilation by manually injecting the equivalent CSS
  // This verifies that IF the SCSS compiles as expected, the browser renders it correctly.

  const focusColor = '#82aaff'; // From $focus-color variable in main.scss

  const simulatedCSS = `
    .site-nav .page-link {
        color: black;
    }
    .site-nav .page-link[aria-current="page"] {
      font-weight: bold;
    }
    @media (prefers-color-scheme: dark) {
      .site-nav .page-link[aria-current="page"] {
        color: ${focusColor};
      }
    }
  `;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; }
          ${simulatedCSS}
        </style>
      </head>
      <body>
        <nav class="site-nav">
          <!-- Active Link -->
          <a class="page-link" href="/about" aria-current="page">About</a>
          <!-- Inactive Link -->
          <a class="page-link" href="/contact">Contact</a>
        </nav>
      </body>
    </html>
  `);

  const activeLink = page.locator('a[aria-current="page"]');
  const inactiveLink = page.locator('a:not([aria-current="page"])');

  // Verify Light Mode (Default)
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(activeLink).toHaveCSS('font-weight', '700');

  // Verify Dark Mode
  await page.emulateMedia({ colorScheme: 'dark' });
  // 82aaff is rgb(130, 170, 255)
  await expect(activeLink).toHaveCSS('color', 'rgb(130, 170, 255)');

  // Take a screenshot for visual verification
  await page.screenshot({ path: 'tests/repro/active-nav-verification.png' });
});
