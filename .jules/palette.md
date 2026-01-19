# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-22 - Active Navigation State
**Learning:** Using `aria-current="page"` serves a dual purpose: it informs screen readers of the active page and provides a robust hook for styling visual indicators without needing separate `.active` classes.
**Action:** Always check navigation menus for active state indicators. If missing, implement `aria-current` first, then style it.
