# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-16 - Active Navigation States
**Learning:** `aria-current="page"` is the correct semantic way to indicate the current page in a navigation menu, and it can be used as a CSS selector for styling. In Jekyll, comparing `page.url` to the link's URL is the standard way to detect the active item.
**Action:** Always check for active states in navigation menus and implement them using ARIA attributes for accessibility and consistency.
