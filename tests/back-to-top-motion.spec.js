const { test, expect } = require('@playwright/test');

test('back-to-top respects prefers-reduced-motion', async ({ page }) => {
  // 1. Mock window.scrollTo to inspect arguments
  await page.setContent(`
    <!DOCTYPE html>
    <html style="height: 2000px;">
    <body>
      <button id="back-to-top">Top</button>
      <script>
        window.scrollToCalls = [];
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options) {
          window.scrollToCalls.push(options);
          originalScrollTo.call(window, options);
        };
      </script>
    </body>
    </html>
  `);

  const fs = require('fs');
  const jsContent = fs.readFileSync('assets/js/back-to-top.js', 'utf8');

  await page.addScriptTag({ content: jsContent });

  // 2. Dispatch DOMContentLoaded manually because addScriptTag runs after the event might have fired
  await page.evaluate(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  // 3. Simulate reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // 4. Click
  const btn = page.locator('#back-to-top');
  await btn.click();

  // 5. Verify scrollTo was called with behavior: 'auto' (or NOT 'smooth')
  const calls = await page.evaluate(() => window.scrollToCalls);

  expect(calls.length).toBeGreaterThan(0);
  const lastCall = calls[calls.length - 1];

  expect(lastCall.behavior).not.toBe('smooth');
});
