const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('anchor links lazy loading', async ({ page }) => {
  // 1. Create a long HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Page</title>
      <style>
        body { margin: 0; padding: 0; }
        .post-content { max-width: 800px; margin: 0 auto; }
        h2 { margin-top: 50px; margin-bottom: 50px; height: 50px; border: 1px solid #ccc; }
        .spacer { height: 1000px; background: #eee; }
        /* Force anchor links to be visible for screenshot verification */
        .anchor-link {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0 0.25rem;
          color: red;
          font-weight: bold;
          opacity: 1;
        }
      </style>
    </head>
    <body>
      <div class="post-content">
  `;

  for (let i = 1; i <= 50; i++) {
    htmlContent += `<h2 id="header-${i}">Header ${i}</h2><div class="spacer">Content ${i}</div>`;
  }

  htmlContent += `
      </div>
    </body>
    </html>
  `;

  // 2. Read the script
  const scriptPath = path.join(process.cwd(), 'assets/js/anchor-links.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  // 3. Load page
  await page.setContent(htmlContent);

  // 4. Inject script
  // The script now handles document.readyState, so it should run init() immediately
  await page.addScriptTag({ content: scriptContent });

  // 5. Verify initial count
  // Viewport is typically 1280x720 in headless, or similar.
  // Header 1 is at ~50px.
  // Header 2 is at ~1100px.
  // rootMargin is 200px.
  // So visible area extended is ~920px (if 720h).
  // Header 2 shouldn't be loaded yet.

  // Wait a bit for IO to trigger
  await page.waitForTimeout(500);

  const initialButtons = await page.locator('.anchor-link').count();
  console.log(`Found ${initialButtons} anchor links initially.`);

  expect(initialButtons).toBeLessThan(50);
  expect(initialButtons).toBeGreaterThan(0); // Should have at least one

  // 6. Scroll to bottom incrementally to trigger loading of all
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);

  for (let y = 0; y <= scrollHeight; y += viewportHeight) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    // Give IO a chance to fire
    await page.waitForTimeout(100);
  }

  // Final wait
  await page.waitForTimeout(500);

  const finalButtons = await page.locator('.anchor-link').count();
  console.log(`Found ${finalButtons} anchor links after scroll.`);

  // Should have all 50 now
  expect(finalButtons).toBe(50);

  // Take a screenshot for visual verification
  // Screenshot the last header to confirm the button is present there
  const header = page.locator('#header-50');
  await header.screenshot({ path: 'verification_anchor_links.png' });
});
