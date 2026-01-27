# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-10-26 - Active Navigation State
**Learning:** Using `aria-current="page"` is a semantic and accessible way to indicate the active page in navigation, which can also be used as a CSS hook. It is superior to just adding a class because it communicates state to assistive technologies.
**Action:** Always check `page.url` against link URLs in navigation loops and apply `aria-current="page"` for the match.
