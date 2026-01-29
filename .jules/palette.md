# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-28 - Active Navigation State
**Learning:** Highlighting the current page in navigation is critical for wayfinding. Using `aria-current="page"` provides semantic meaning for screen readers, while `font-weight: bold` offers a clear visual cue without relying solely on color (good for accessibility).
**Action:** Always verify navigation links have `aria-current` logic. In Jekyll, compare `page.url` with the link's URL.
