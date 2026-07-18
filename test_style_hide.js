const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8081/style_hide.html');
  const h1 = await page.isVisible('h1');
  console.log('Main page h1 visible:', h1);

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <iframe sandbox="allow-scripts" src="http://localhost:8081/style_hide.html"></iframe>
    </body>
    </html>
  `);

  await page.waitForTimeout(1000);

  const frame = page.frames()[1];
  const frame_h1 = await frame.isVisible('h1');
  console.log('Frame h1 visible (sandboxed):', frame_h1);

  await browser.close();
})();
