# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2026-02-05 - Active Navigation State
**Learning:** Using `aria-current="page"` for active navigation links serves a dual purpose: it informs screen readers of the user's location and provides a semantic hook for CSS styling, eliminating the need for separate `.active` classes.
**Action:** Implement active states by conditionally adding the `aria-current` attribute in the HTML loop and styling the `[aria-current="page"]` selector in CSS.
