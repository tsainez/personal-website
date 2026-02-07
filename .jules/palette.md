# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-16 - Active Navigation State
**Learning:** Adding `aria-current="page"` to navigation links significantly improves accessibility for screen readers by indicating the current context within a menu. Visual feedback (like bold text) reinforces this for sighted users.
**Action:** Always check if a site's navigation provides context about the current page, and implement `aria-current` if missing. CSS should reflect this semantic state.
