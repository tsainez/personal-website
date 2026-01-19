const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const reproPath = path.join(__dirname, '../tests/repro/repro_anchor_links.html');
  await page.goto(`file://${reproPath}`);

  // Scroll to make sure anchors are loaded
  const header1 = page.locator('#header-1');
  await header1.scrollIntoViewIfNeeded();

  // Wait for it to appear
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'verification/anchor_links.png' });

  await browser.close();
})();
