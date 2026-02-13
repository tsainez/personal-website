# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-10-26 - Active Navigation State
**Learning:** Using `aria-current="page"` is the semantic standard for indicating the active page in a navigation menu. It provides a hook for both accessibility (screen readers announce "Current page") and CSS styling (e.g., `[aria-current="page"]`), keeping the implementation clean and avoiding custom classes like `.active`.
**Action:** Always check `page.url` against the link URL in navigation loops to apply this attribute.

## 2025-11-15 - Anchor Link Iconography
**Learning:** Replacing the default `#` character with an SVG icon for anchor links significantly improves visual polish and clarity. The `#` symbol can be ambiguous, while a link icon is universally understood. Using `width="1em" height="1em"` ensures the icon scales perfectly with the heading text size.
**Action:** Always prefer SVG icons over text characters for functional UI elements like anchor links or "copy" buttons, but ensure `aria-label` is present for accessibility.
