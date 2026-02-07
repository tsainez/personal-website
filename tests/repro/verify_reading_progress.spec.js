const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('reading-progress layout thrashing check', async ({ page }) => {
  // 1. Setup a long page with the progress bar
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="height: 10000px; margin: 0;">
      <div id="reading-progress" style="width: 0%; height: 5px; background: red; position: fixed; top: 0;"></div>
      <div style="height: 10000px;">Content</div>
    </body>
    </html>
  `);

  // 2. Instrument layout properties to count access
  await page.evaluate(() => {
    window.layoutReads = 0;

    // Helper to spy on a property
    function spyOnProperty(proto, prop) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
      if (!descriptor) return; // Might be on a different prototype chain

      Object.defineProperty(proto, prop, {
        get: function() {
          window.layoutReads++;
          return descriptor.get.call(this);
        }
      });
    }

    // scrollHeight and clientHeight are on Element.prototype
    spyOnProperty(Element.prototype, 'scrollHeight');
    spyOnProperty(Element.prototype, 'clientHeight');
  });

  // 3. Inject the script
  // We need to strip the IIFE potentially or just run it. The file is an IIFE.
  const jsContent = fs.readFileSync('assets/js/reading-progress.js', 'utf8');
  await page.addScriptTag({ content: jsContent });

  // 4. Scroll multiple times to trigger scroll events and RAF
  await page.evaluate(async () => {
    // Scroll in steps to ensure events fire
    for (let i = 0; i < 100; i++) {
      window.scrollTo(0, i * 100);
      // Wait for a frame to allow the scroll handler to run
      await new Promise(r => requestAnimationFrame(r));
      await new Promise(r => setTimeout(r, 1)); // minimal delay
    }
  });

  // 5. Check layout reads
  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads: ${reads}`);

  // 6. Verify functionality
  const width = await page.evaluate(() => {
    return document.getElementById('reading-progress').style.width;
  });
  console.log(`Final width: ${width}`);
  expect(parseFloat(width)).toBeGreaterThan(0);
});
