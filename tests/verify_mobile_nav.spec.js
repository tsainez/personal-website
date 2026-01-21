const { test, expect } = require('@playwright/test');
const path = require('path');

test('Mobile Navigation Accessibility', async ({ page }) => {
  // Inject the HTML structure matching _includes/header.html
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <nav class="site-nav">
        <!-- The checkbox hack structure -->
        <input type="checkbox" id="nav-trigger" class="nav-trigger" />
        <label for="nav-trigger" aria-label="Toggle navigation" role="button" aria-controls="nav-menu" aria-expanded="false" tabindex="0">
          <span class="menu-icon">Menu</span>
        </label>

        <div class="trigger" id="nav-menu">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
        </div>
      </nav>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Add the script file we created
  // We use path.resolve to ensure we find the file from the project root
  await page.addScriptTag({ path: path.resolve(__dirname, '../assets/js/mobile-nav.js') });

  const label = page.locator('label[for="nav-trigger"]');
  const checkbox = page.locator('#nav-trigger');

  // Verify initial state
  // The script runs immediately, so it should have set the initial state if logic requires,
  // but our logic just ensures consistency.
  await expect(label).toHaveAttribute('aria-expanded', 'false');
  await expect(label).toHaveAttribute('aria-label', 'Toggle navigation');
  await expect(checkbox).not.toBeChecked();

  // --- Test 1: Click interaction (Mouse) ---
  // Clicking the label should toggle the checkbox (native behavior) and update ARIA (our script)
  await label.click();
  await expect(checkbox).toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'true');
  await expect(label).toHaveAttribute('aria-label', 'Close navigation');

  await label.click();
  await expect(checkbox).not.toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'false');
  await expect(label).toHaveAttribute('aria-label', 'Toggle navigation');

  // --- Test 2: Keyboard interaction (Space) ---
  // Space on a label doesn't natively toggle the checkbox, so our script must handle it.
  await label.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'true');
  await expect(label).toHaveAttribute('aria-label', 'Close navigation');

  await page.keyboard.press('Space');
  await expect(checkbox).not.toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'false');

  // --- Test 3: Keyboard interaction (Enter) ---
  // Enter on a label doesn't natively toggle the checkbox, so our script must handle it.
  await label.focus();
  await page.keyboard.press('Enter');
  await expect(checkbox).toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Enter');
  await expect(checkbox).not.toBeChecked();
  await expect(label).toHaveAttribute('aria-expanded', 'false');
});
