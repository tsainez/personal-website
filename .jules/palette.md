# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-10-26 - Active Navigation State
**Learning:** Using `aria-current="page"` is the semantic standard for indicating the active page in a navigation menu. It provides a hook for both accessibility (screen readers announce "Current page") and CSS styling (e.g., `[aria-current="page"]`), keeping the implementation clean and avoiding custom classes like `.active`.
**Action:** Always check `page.url` against the link URL in navigation loops to apply this attribute.

## 2026-02-11 - Print Styles for Content
**Learning:** Users still print articles (or save as PDF). Default web styles often clutter the page with navigation, footers, and interactive elements like progress bars, wasting ink and distracting from the content.
**Action:** Add a simple `@media print` stylesheet that hides `.site-header`, `.site-footer`, and interactive widgets, while ensuring high contrast (black on white) and expanding external links for offline reference.
## 2026-05-08 - Mobile Navigation Accessibility\n**Learning:** The default Minima theme relies on a hidden checkbox (`.nav-trigger`) combined with a `<label>` for the mobile menu toggle. Because the checkbox is `display: none`, it's removed from the accessibility tree, making the mobile menu completely inaccessible via keyboard. \n**Action:** Instead of `display: none`, apply `clip: rect(0, 0, 0, 0)` and `display: block !important` to visually hide the checkbox while keeping it focusable. Then, use the `:focus-visible` pseudo-class paired with the adjacent sibling selector (`+ label`) to draw a clear focus ring around the visible label, ensuring screen reader and keyboard users can navigate the site.
