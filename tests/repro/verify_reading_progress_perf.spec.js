const { test, expect } = require('@playwright/test');

test('reading progress bar minimizes layout thrashing', async ({ page }) => {
  // Navigate to the repro page
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Inject script to spy on layout properties
  // We need to reload to ensure the script is injected before any other scripts run
  await page.addInitScript(() => {
    window.layoutAccessCount = 0;

    // Helper to spy on a property
    function spyOnProperty(proto, propName) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, propName);
      if (!descriptor) return; // Property not found on this prototype

      Object.defineProperty(proto, propName, {
        get() {
          // Only count if it's the document element we care about
          if (this === document.documentElement) {
            window.layoutAccessCount++;
          }
          return descriptor.get.call(this);
        }
      });
    }

    // scrollHeight/clientHeight are on Element.prototype in modern browsers
    spyOnProperty(Element.prototype, 'scrollHeight');
    spyOnProperty(Element.prototype, 'clientHeight');
  });

  // Reload to apply init script cleanly
  await page.reload();

  // Wait for initial layout/script execution
  await page.waitForTimeout(100);

  // Reset counter to ignore initial page load accesses
  await page.evaluate(() => {
    window.layoutAccessCount = 0;
  });

  // Scroll
  // We scroll multiple times to trigger multiple scroll events
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(100);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(100);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500); // Wait for scroll handler to run

  // Check access count
  const count = await page.evaluate(() => window.layoutAccessCount);

  console.log(`Layout access count during scroll: ${count}`);

  // With optimization, this should be 0 because we cache the values.
  // Without optimization, it will be proportional to the number of scroll frames (e.g. > 10).
  expect(count).toBeLessThan(5);
});
