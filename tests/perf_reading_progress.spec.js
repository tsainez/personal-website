const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('measures reading-progress layout thrashing', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Read the script content
  const scriptPath = path.join(__dirname, '../assets/js/reading-progress.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body { height: 5000px; margin: 0; }
      #reading-progress { position: fixed; top: 0; left: 0; height: 5px; background: red; width: 0%; transition: width 0.1s; }
    </style>
    </head>
    <body>
    <div id="reading-progress"></div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Spy on scrollHeight and clientHeight
  await page.evaluate(() => {
    window.layoutReads = 0;
    console.log('Spying setup...');

    const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    const originalClientHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');

    if (originalScrollHeightDesc) {
        Object.defineProperty(Element.prototype, 'scrollHeight', {
        get: function() {
            if (this === document.documentElement) {
                window.layoutReads++;
            }
            return originalScrollHeightDesc.get.call(this);
        },
        configurable: true
        });
    } else {
        console.log('scrollHeight descriptor not found on Element.prototype');
    }

    if (originalClientHeightDesc) {
        Object.defineProperty(Element.prototype, 'clientHeight', {
        get: function() {
            if (this === document.documentElement) {
                window.layoutReads++;
            }
            return originalClientHeightDesc.get.call(this);
        },
        configurable: true
        });
    } else {
        console.log('clientHeight descriptor not found on Element.prototype');
    }
  });

  // Inject the script
  await page.addScriptTag({ content: scriptContent });

  // Scroll a bit
  await page.evaluate(async () => {
    // Scroll multiple times to trigger scroll events
    for (let i = 1; i <= 50; i++) {
        window.scrollTo(0, i * 20);
        // Wait a bit to allow rAF to fire
        await new Promise(r => setTimeout(r, 16));
    }
  });

  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads: ${reads}`);

  // Verify functionality: Width should be > 0
  const width = await page.evaluate(() => {
      return document.getElementById('reading-progress').style.width;
  });
  console.log(`Final width: ${width}`);
  expect(parseFloat(width)).toBeGreaterThan(0);
});
