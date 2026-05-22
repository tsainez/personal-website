const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('reading progress bar resize performance', async ({ page }) => {
  const scriptPath = path.join(__dirname, '../../assets/js/reading-progress.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; }
        #reading-progress {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 4px; background: red;
          transform: scaleX(0); transform-origin: left; will-change: transform;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <script>
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
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    window.layoutReads = 0;
  });

  // Simulate resize events
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setViewportSize({ width: 801, height: 601 });
  await page.setViewportSize({ width: 802, height: 602 });
  await page.setViewportSize({ width: 803, height: 603 });
  await page.setViewportSize({ width: 804, height: 604 });
  await page.waitForTimeout(200);

  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads during resize: ${reads}`);

  // We should debounce to reduce layout reads to a small number
  expect(reads).toBeLessThan(5);
});
