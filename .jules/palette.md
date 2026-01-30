# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-10-26 - Active Navigation State
**Learning:** `aria-current="page"` is the semantic gold standard for indicating the active page in a navigation menu. It solves both the accessibility requirement (screen readers verify "current page") and the styling requirement (CSS attribute selector) in one go, avoiding the need for fragile "active" classes.
**Action:** Always check `_includes/header.html` in Jekyll sites to ensure the active state logic exists; it's frequently missed in default themes.
