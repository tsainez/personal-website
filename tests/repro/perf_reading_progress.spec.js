
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('reading progress bar optimization verification', async ({ page }) => {
  // Read the script content
  const scriptContent = fs.readFileSync(path.join(__dirname, '../../assets/js/reading-progress.js'), 'utf8');

  // Set up the page with enough content to scroll
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; padding: 0; }
        #reading-progress {
          position: fixed; top: 0; left: 0; width: 0%; height: 4px; background: red;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <div id="content">Content</div>
    </body>
    </html>
  `);

  // Inject spies on scrollHeight and clientHeight BEFORE the script runs
  await page.evaluate(() => {
    window.layoutReads = 0;
    const originalScrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    const originalClientHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');

    Object.defineProperty(Element.prototype, 'scrollHeight', {
      get: function() {
        if (this === document.documentElement) {
          window.layoutReads++;
        }
        return originalScrollHeight.get.call(this);
      }
    });

    Object.defineProperty(Element.prototype, 'clientHeight', {
      get: function() {
        if (this === document.documentElement) {
          window.layoutReads++;
        }
        return originalClientHeight.get.call(this);
      }
    });
  });

  // Inject the script
  await page.addScriptTag({ content: scriptContent });

  // Initial update should trigger reads
  // We reset after a short delay to allow initial execution
  await page.waitForTimeout(100);
  await page.evaluate(() => {
    window.layoutReads = 0;
  });

  // Scroll
  await page.evaluate(async () => {
    for (let i = 0; i < 10; i++) {
        window.scrollTo(0, 1000); // Scroll deep
        await new Promise(r => requestAnimationFrame(r));
        await new Promise(r => setTimeout(r, 20));
    }
  });

  // Check read count
  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads during scroll: ${reads}`);

  // With optimization, this should be 0 because we used cached values
  expect(reads).toBe(0);

  // Verify functionality: Progress bar should not be 0% (since we scrolled)
  const width = await page.evaluate(() => document.getElementById('reading-progress').style.width);
  console.log(`Progress bar width: ${width}`);
  expect(width).not.toBe('0%');
  expect(parseFloat(width)).toBeGreaterThan(0);
});
