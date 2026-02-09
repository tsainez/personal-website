const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('measure layout reads in reading-progress.js', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../../assets/js/reading-progress.js'), 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { height: 5000px; margin: 0; padding: 0; }
        #reading-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 0%;
          height: 4px;
          background-color: blue;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div id="reading-progress"></div>
      <div style="padding: 20px;">
        <h1>Test Page</h1>
        <p>Scroll down...</p>
      </div>
      <script>
        window.layoutReads = 0;

        // Helper to spy on a property
        function spyOnProperty(prototype, propertyName) {
            const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
            if (!descriptor) {
                console.log('Descriptor not found for ' + propertyName);
                return;
            }
            Object.defineProperty(prototype, propertyName, {
                get() {
                    window.layoutReads++;
                    return descriptor.get.call(this);
                },
                configurable: true
            });
        }

        // Spy on scrollHeight and clientHeight
        spyOnProperty(HTMLElement.prototype, 'scrollHeight') || spyOnProperty(Element.prototype, 'scrollHeight');
        spyOnProperty(Element.prototype, 'clientHeight');
      </script>
      <script>
        // Trigger initial read verification to ensure spy works
        // This increments layoutReads
        const el = document.documentElement;
        const h = el.scrollHeight;
      </script>
      <script>${scriptContent}</script>
    </body>
    </html>
  `);

  // Check reads after setup. The script runs immediately, so it should have read dimensions once.
  // Plus our verification read above.
  const initialReads = await page.evaluate(() => window.layoutReads);
  console.log('Reads after setup:', initialReads);

  // Scroll loop
  await page.evaluate(async () => {
    for (let i = 0; i < 1000; i += 100) {
      window.scrollTo(0, i);
      await new Promise(r => requestAnimationFrame(r));
    }
  });

  const finalReads = await page.evaluate(() => window.layoutReads);
  console.log(`Final Layout reads: ${finalReads}`);

  // With optimization, finalReads should equal initialReads (0 additional reads during scroll)
  // Or at most 1-2 if resize triggered (which it shouldn't in this test)
  expect(finalReads).toBe(initialReads);
});
