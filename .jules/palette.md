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

## 2026-05-10 - Mobile Navigation Accessibility
**Learning:** Overriding default theme styles that use `display: none` for custom toggle patterns (like the "checkbox hack" used for mobile navigation) is necessary for keyboard accessibility. Elements hidden with `display: none` are removed from the accessibility tree and cannot receive focus.
**Action:** When implementing or fixing custom toggle patterns, make the trigger visually hidden but still in the accessibility tree (e.g., using `clip: rect(0, 0, 0, 0)` and `width: 1px; height: 1px`) and ensure it has proper focus styles (using `:focus-visible` on the trigger and applying it to the adjacent `label`).

## 2026-05-17 - Skip Link Targets Must Be Focusable
**Learning:** A "Skip to content" link visually scrolls the user to the main content, but unless the target container has `tabindex="-1"`, programmatic focus and screen reader context remain at the top of the page. Without this, the next `Tab` press starts the navigation cycle over again, defeating the purpose of the skip link.
**Action:** Always add `tabindex="-1"` to the container element referenced by a skip link's `href` (e.g., `<main id="main-content" tabindex="-1">`).

## 2026-10-31 - Checkbox Hack Accessibility
**Learning:** For accessible 'checkbox hack' implementations (e.g., mobile navigation via hidden checkbox), the `aria-label` must be placed directly on the `<input type="checkbox">` element, not its visual `<label>`, to ensure proper screen reader announcements. Adding `title` attributes to icon-only buttons provides native tooltips for sighted users.
**Action:** Always check ARIA label placement for hidden inputs acting as toggles, and use `title` attributes for icon-only interactions.
