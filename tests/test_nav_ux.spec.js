const { test, expect } = require('@playwright/test');
const path = require('path');

test('navigation link with aria-current="page" has distinct visual style', async ({ page }) => {
    // Load the repro file
    const reproPath = path.resolve(__dirname, 'repro/nav_repro.html');
    await page.goto(`file://${reproPath}`);

    // Locate the active link
    const activeLink = page.locator('a[aria-current="page"]');
    const inactiveLink = page.locator('a:not([aria-current="page"])').first();

    // Check if it's visible
    await expect(activeLink).toBeVisible();

    // Verify styles on the active link
    // Note: '700' usually corresponds to bold
    await expect(activeLink).toHaveCSS('font-weight', '700');
    await expect(activeLink).toHaveCSS('text-decoration-line', 'underline');

    // Verify styles on the inactive link (should not be bold)
    // Normal weight is usually 400
    await expect(inactiveLink).not.toHaveCSS('font-weight', '700');
    await expect(inactiveLink).not.toHaveCSS('text-decoration-line', 'underline');
});
