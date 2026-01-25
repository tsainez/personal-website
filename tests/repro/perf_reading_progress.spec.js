const { test, expect } = require('@playwright/test');

test('reading progress bar minimizes layout thrashing', async ({ page }) => {
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Wait for the script to initialize and the bar to be present
  await page.locator('#reading-progress').waitFor({ state: 'attached' });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Inject spy to count access to layout-triggering properties on documentElement
  await page.evaluate(() => {
    window.__layoutAccessCount = 0;

    const props = ['scrollHeight', 'clientHeight'];

    props.forEach(prop => {
        let proto = Element.prototype;
        // Find where the property is defined
        while (proto && !Object.getOwnPropertyDescriptor(proto, prop)) {
            proto = Object.getPrototypeOf(proto);
        }

        if (!proto) {
            console.log(`Could not find descriptor for ${prop}`);
            return;
        }

        const originalDesc = Object.getOwnPropertyDescriptor(proto, prop);
        Object.defineProperty(proto, prop, {
          get: function() {
            if (this === document.documentElement) {
              // console.log(`Access to ${prop} on documentElement`);
              window.__layoutAccessCount++;
            }
            return originalDesc.get.call(this);
          },
          configurable: true
        });
    });
  });

  // Reset count before scrolling
  await page.evaluate(() => {
      window.__layoutAccessCount = 0;
  });

  // Scroll significantly in steps to force multiple frames
  for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);
  }

  // Wait enough time for rAF callbacks to fire
  await page.waitForTimeout(500);

  const count = await page.evaluate(() => window.__layoutAccessCount);
  console.log(`Layout access count during scroll: ${count}`);

  // The optimized version should access these properties 0 times during scroll
  // (only on resize or initial load)
  // We allow a small buffer just in case, but definitely < 10.
  // The unoptimized version accesses 2 properties per frame.
  expect(count).toBeLessThan(10);
});
