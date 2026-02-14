const { test, expect } = require('@playwright/test');

test('reading progress bar layout thrashing', async ({ page }) => {
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Inject spy on scrollHeight and clientHeight
  await page.evaluate(() => {
    window.layoutReads = 0;

    // We need to access the prototype where these are defined.
    // Usually Element.prototype or HTMLElement.prototype.
    let proto = Element.prototype;
    let scrollHeightDesc = Object.getOwnPropertyDescriptor(proto, 'scrollHeight');
    let clientHeightDesc = Object.getOwnPropertyDescriptor(proto, 'clientHeight');

    if (!scrollHeightDesc) {
       proto = HTMLElement.prototype;
       scrollHeightDesc = Object.getOwnPropertyDescriptor(proto, 'scrollHeight');
       clientHeightDesc = Object.getOwnPropertyDescriptor(proto, 'clientHeight');
    }

    if (!scrollHeightDesc || !clientHeightDesc) {
      console.error('Could not find property descriptors for scrollHeight or clientHeight');
      return;
    }

    Object.defineProperty(proto, 'scrollHeight', {
      get: function() {
        // Only count if it's the document element (the one we care about in the script)
        if (this === document.documentElement) {
            window.layoutReads++;
        }
        return scrollHeightDesc.get.call(this);
      },
      configurable: true
    });

    Object.defineProperty(proto, 'clientHeight', {
      get: function() {
        if (this === document.documentElement) {
            window.layoutReads++;
        }
        return clientHeightDesc.get.call(this);
      },
      configurable: true
    });
  });

  // trigger initial update
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
  await page.waitForTimeout(100);

  // Reset count after initial update
  await page.evaluate(() => window.layoutReads = 0);

  // Scroll a bit to trigger the event listener
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(100); // Wait for rAF

  // Check the count
  const reads = await page.evaluate(() => window.layoutReads);

  console.log(`Layout reads during scroll: ${reads}`);

  // With optimization, this should be 0.
  expect(reads).toBe(0);
});
