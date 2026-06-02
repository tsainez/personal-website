const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('copy code layout performance innerText vs textContent', async ({ page }) => {
  // Read the script content to test it functionally if we want to,
  // but here we just prove the performance difference and ensure it's changed in the script

  const scriptPath = path.join(__dirname, '../assets/js/copy-code.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Verify the script actually uses textContent now
  expect(scriptContent).toContain('code.textContent');
  expect(scriptContent).not.toContain('code.innerText');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .box { width: 100px; height: 100px; background: red; margin: 10px; float: left; }
      </style>
    </head>
    <body>
      <div id="content">
        ${Array.from({ length: 5000 }).map(() => '<div class="box"></div>').join('')}
      </div>
      <div class="highlight">
        <pre><code id="large-code">
${Array.from({ length: 100 }).map((_, i) => `function test${i}() { console.log("hello world ${i}"); return ${i}; }`).join('\n')}
        </code></pre>
      </div>
      <script>
        window.measureInnerText = () => {
          // Mutate DOM to invalidate layout
          document.getElementById('content').appendChild(document.createElement('div'));

          const start = performance.now();
          const text = document.getElementById('large-code').innerText; // Forces layout!
          const end = performance.now();
          return end - start;
        };

        window.measureTextContent = () => {
          // Mutate DOM to invalidate layout
          document.getElementById('content').appendChild(document.createElement('div'));

          const start = performance.now();
          const text = document.getElementById('large-code').textContent; // Does NOT force layout!
          const end = performance.now();
          return end - start;
        };
      </script>
    </body>
    </html>
  `);

  let innerTextTimes = [];
  let textContentTimes = [];

  // Warm up
  await page.evaluate(() => window.measureInnerText());
  await page.evaluate(() => window.measureTextContent());

  for (let i = 0; i < 5; i++) {
    innerTextTimes.push(await page.evaluate(() => window.measureInnerText()));
    textContentTimes.push(await page.evaluate(() => window.measureTextContent()));
  }

  const innerTextAvg = innerTextTimes.reduce((a, b) => a + b, 0) / innerTextTimes.length;
  const textContentAvg = textContentTimes.reduce((a, b) => a + b, 0) / textContentTimes.length;

  console.log('innerText avg (ms): ' + innerTextAvg.toFixed(2));
  console.log('textContent avg (ms): ' + textContentAvg.toFixed(2));

  // Expect textContent to be substantially faster (usually near 0ms vs >10ms for innerText with 5000 boxes)
  expect(textContentAvg).toBeLessThan(innerTextAvg);

  // Expect textContent to be substantially faster (usually near 0ms vs >10ms for innerText with 5000 boxes)
  // Instead of a hardcoded threshold which might be flaky in CI, we assert it's at least 50% faster
  expect(textContentAvg).toBeLessThan(innerTextAvg * 0.5);
});
