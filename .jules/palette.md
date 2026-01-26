# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-16 - Active Navigation State
**Learning:** Adding `aria-current="page"` is the standard accessible way to indicate the current page. When styling this, checking for existing design tokens (like `$focus-color`) in `assets/main.scss` ensures consistency, but verifying their existence in the codebase is crucial to avoid build failures in different environments.
**Action:** Always verify global SCSS variables exist before using them in new rules, or provide fallback values if the environment might vary.
