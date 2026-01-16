const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Reading Progress Bar', () => {
  test('should appear on post pages and update width on scroll', async ({ page }) => {
    // 1. Setup
    const progressJs = fs.readFileSync(path.join(__dirname, '../assets/js/reading-progress.js'), 'utf8');

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { height: 2000px; margin: 0; padding: 0; }
          .reading-progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            z-index: 1000;
          }
          .reading-progress-bar {
            width: 0%;
            height: 100%;
            background: blue;
          }
        </style>
      </head>
      <body>
        <div id="reading-progress-container" class="reading-progress-container" aria-hidden="true">
          <div id="reading-progress-bar" class="reading-progress-bar"></div>
        </div>
        <div style="height: 2000px;">Content</div>
      </body>
      </html>
    `);

    // Inject the script
    await page.addScriptTag({ content: progressJs });

    const progressBar = page.locator('#reading-progress-bar');
    await expect(progressBar).toHaveCSS('width', /0px|0%/);

    // Scroll halfway
    await page.evaluate(() => {
        window.scrollTo(0, 1000);
        window.dispatchEvent(new Event('scroll'));
    });

    // Check for non-zero width
    // Use poll to wait for the value to update
    await expect.poll(async () => {
        const style = await progressBar.getAttribute('style');
        return style && style.includes('width:') && !style.includes('0%');
    }).toBeTruthy();

    // Scroll to bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
        window.dispatchEvent(new Event('scroll'));
    });

    // Check for near 100% width
    await expect.poll(async () => {
        const style = await progressBar.getAttribute('style');
        return style;
    }).toContain('width: 100%');
  });

  test('should gracefully handle missing element', async ({ page }) => {
    const progressJs = fs.readFileSync(path.join(__dirname, '../assets/js/reading-progress.js'), 'utf8');
    await page.setContent(`<body>No progress bar here</body>`);
    await page.addScriptTag({ content: progressJs });
    await page.evaluate(() => window.scrollTo(0, 100));
  });
});
