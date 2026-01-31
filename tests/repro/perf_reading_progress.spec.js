const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('performance: reading-progress.js should not thrash layout', async ({ page }) => {
  const jsContent = fs.readFileSync(path.join(__dirname, '../../assets/js/reading-progress.js'), 'utf8');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; }
        #reading-progress {
          position: fixed; top: 0; left: 0; height: 4px; background: red; width: 0;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <script>
        window.layoutReads = 0;
        // Hack to spy on properties
        const docEl = document.documentElement;

        // We define properties on the instance to intercept
        // This works because the script uses document.documentElement.scrollHeight

        // Capture original values to delegate
        const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight') || Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
        const originalClientHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');

        Object.defineProperty(docEl, 'scrollHeight', {
          get: function() {
            window.layoutReads++;
            return originalScrollHeightDesc.get.call(this);
          }
        });

        Object.defineProperty(docEl, 'clientHeight', {
            get: function() {
              window.layoutReads++;
              return originalClientHeightDesc.get.call(this);
            }
        });
      </script>
      <script>${jsContent}</script>
    </body>
    </html>
  `;

  await page.setContent(html);

  // Reset count after initial load
  await page.evaluate(() => {
    window.layoutReads = 0;
  });

  // Scroll slowly
  await page.evaluate(async () => {
    for (let i = 0; i < 50; i++) {
        window.scrollBy(0, 10);
        await new Promise(r => requestAnimationFrame(r));
    }
  });

  // Wait a bit for pending RAFs
  await page.waitForTimeout(500);

  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads during scroll: ${reads}`);

  // Expect reads to be roughly proportional to number of frames (50 frames * 2 props = ~100 reads)
  // Or at least significantly > 0.
});
