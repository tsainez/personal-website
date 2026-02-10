const { test, expect } = require('@playwright/test');

test('reading progress bar minimizes layout thrashing', async ({ page }) => {
  // 1. Setup Spy
  await page.goto('http://localhost:8081/tests/repro/repro_reading_progress.html');

  // Inject a spy to count property accesses on document.documentElement
  await page.evaluate(() => {
    window.layoutReads = 0;
    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      get() {
        window.layoutReads++;
        // return originalScrollHeight.get.call(this); // recursive call if not careful
        // Use a safe way to get the value, or just return a mock if needed, but we want real behavior.
        // Actually, we can just spy on the prototype but that affects everything.
        // Let's just mock it for this specific element since we know the script uses document.documentElement
        return 5000; // Mock value matching CSS
      }
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      get() {
        window.layoutReads++;
        return 800; // Mock value
      }
    });
  });

  // 2. Scroll
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(100); // Wait for potential rAF

  // 3. Check layout reads
  const reads = await page.evaluate(() => window.layoutReads);
  console.log(`Layout reads during scroll: ${reads}`);

  // Expect reads to be > 0 initially (before optimization)
  // After optimization, we expect 0 reads during scroll (only initial read)
  expect(reads).toBe(0);
});
