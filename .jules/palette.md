# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-28 - SCSS Verification without Build
**Learning:** Verifying SCSS changes in an environment without a Jekyll build requires a hybrid approach: static regex analysis of the source file to confirm code presence, combined with dynamic verification using Playwright where we inject a simulated "compiled" CSS into a test page.
**Action:** When working on style logic (like dark mode overrides), create a Playwright test that regex-checks the SCSS file for the new rules, then injects a CSS block (mocking variables) into `page.setContent` to verify the visual outcome (computed styles).
