# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-28 - Navigation Active State
**Learning:** Default Jekyll themes like Minima may lack `aria-current="page"` on navigation links, forcing users to rely on visual context only. Adding this attribute conditionally using `page.url` improves accessibility significantly.
**Action:** When working with Jekyll navigation loops, always check for and add `aria-current="page"` logic to the active link.
