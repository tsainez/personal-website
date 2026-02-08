const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('reading progress optimized layout reads', async ({ page }) => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../../assets/js/reading-progress.js'), 'utf8');

  const htmlContent = `
    <!DOCTYPE html>
    <html style="height: 100%;">
    <head>
      <style>
        body { height: 5000px; margin: 0; padding: 0; }
        #reading-progress { width: 0%; height: 4px; position: fixed; top: 0; background: red; }
      </style>
      <script>
        window.layoutReads = 0;

        // Hook scrollHeight on Element.prototype (Chrome) or HTMLElement.prototype
        let descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
        let proto = Element.prototype;
        if (!descriptor) {
             descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
             proto = HTMLElement.prototype;
        }

        if (descriptor) {
            Object.defineProperty(proto, 'scrollHeight', {
                get() {
                    window.layoutReads++;
                    return descriptor.get.call(this);
                },
                configurable: true
            });
            console.log('Hooked scrollHeight');
        } else {
            console.error('Could not find scrollHeight descriptor');
        }

        // Hook clientHeight
        let descriptorClient = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');
        let protoClient = Element.prototype;
        if (!descriptorClient) {
             descriptorClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
             protoClient = HTMLElement.prototype;
        }

        if (descriptorClient) {
            Object.defineProperty(protoClient, 'clientHeight', {
                get() {
                    window.layoutReads++;
                    return descriptorClient.get.call(this);
                },
                configurable: true
            });
            console.log('Hooked clientHeight');
        } else {
             console.error('Could not find clientHeight descriptor');
        }
      </script>
    </head>
    <body>
      <div id="reading-progress"></div>
      <script>
      ${scriptContent}
      </script>
    </body>
    </html>
  `;

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.setContent(htmlContent);

  // Initial read count
  const initialReads = await page.evaluate(() => window.layoutReads);
  console.log(`Initial layout reads: ${initialReads}`);

  // Scroll
  await page.evaluate(async () => {
    window.layoutReads = 0;
    // Simulate scroll
    for (let i = 0; i < 2000; i += 100) {
      window.scrollTo(0, i);
      // Wait for rAF
      await new Promise(r => requestAnimationFrame(r));
       await new Promise(r => setTimeout(r, 16));
    }
  });

  // Check count
  const scrollReads = await page.evaluate(() => window.layoutReads);
  console.log(`Scroll layout reads: ${scrollReads}`);

  // Assert optimization: reads should be 0 during scroll as values are cached
  expect(scrollReads).toBe(0);
});
