const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ viewport: { width: 800, height: 600 } });

test('anchor links are lazy loaded', async ({ page }) => {
  const reproPath = path.join(__dirname, 'repro/repro_anchor_links.html');
  await page.goto(`file://${reproPath}`);

  // Allow JS to run
  await page.waitForTimeout(500);

  // Header 1 is visible, should have anchor
  const header1 = page.locator('#header-1');
  await expect(header1.locator('.anchor-link')).toHaveCount(1);

  // Header 2 is off-screen.
  const header2 = page.locator('#header-2');

  const countBeforeScroll = await header2.locator('.anchor-link').count();
  console.log(`Anchor count for hidden header: ${countBeforeScroll}`);

  // This expectation verifies lazy loading.
  // It will fail if anchors are eager loaded.
  expect(countBeforeScroll).toBe(0);

  // Scroll into view
  await header2.scrollIntoViewIfNeeded();

  // Wait for observer
  await page.waitForTimeout(500);

  // Now it should be there
  await expect(header2.locator('.anchor-link')).toHaveCount(1);
});
