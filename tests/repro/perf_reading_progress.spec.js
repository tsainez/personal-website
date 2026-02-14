const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('reading progress bar layout performance', async ({ page }) => {
  // Read the script content
  const scriptPath = path.join(__dirname, '../../assets/js/reading-progress.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Inject HTML and Script
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; }
        #reading-progress {
          position: fixed;
          top: 0; left: 0; width: 0%; height: 4px; background: red;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <script>
        // Performance Spy
        window.layoutReads = 0;
        const targetProto = Element.prototype;
        const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(targetProto, 'scrollHeight');
        const originalClientHeightDesc = Object.getOwnPropertyDescriptor(targetProto, 'clientHeight');

        Object.defineProperty(targetProto, 'scrollHeight', {
          get: function() {
            window.layoutReads++;
            return originalScrollHeightDesc.get.call(this);
          }
        });

        Object.defineProperty(targetProto, 'clientHeight', {
            get: function() {
              window.layoutReads++;
              return originalClientHeightDesc.get.call(this);
            }
          });
      </script>
      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `);

  const progressBar = page.locator('#reading-progress');

  // Wait for initial layout/resize observer to settle
  await page.waitForTimeout(500);

  // Reset counter after initial load
  await page.evaluate(() => {
    window.layoutReads = 0;
  });

  // Scroll in steps to trigger multiple frames
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(50); // Wait enough for a frame to potentially fire
  }

  // Wait for trailing rAF
  await page.waitForTimeout(500);

  // Check functional correctness
  const width = await progressBar.getAttribute('style');
  expect(width).toMatch(/width: \d+(\.\d+)?%;/);
  expect(width).not.toBe('width: 0%;');

  // Check performance
  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads during scroll: ${reads}`);

  // With optimization, we should NOT read scrollHeight/clientHeight during scroll.
  expect(reads).toBe(0);
});
