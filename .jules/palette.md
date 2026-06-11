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

## 2026-05-23 - Checkbox Hack Accessibility
**Learning:** When using the "checkbox hack" pattern for toggles (like mobile navigation menus), placing `aria-label` on the visual `<label>` element is insufficient because the `<label>` is not the actual focusable control. Screen readers will not announce the label when the user focuses the visually hidden `<input type="checkbox">`.
**Action:** Always place the accessible name (`aria-label`) directly on the visually hidden `<input type="checkbox">` element. Additionally, add a `title` attribute to the visual `<label>` to provide a native tooltip for sighted users on hover, and ensure any internal decorative icons (like SVGs) have `aria-hidden="true"`.
## 2026-10-27 - Icon Accessibility and Tooltips
**Learning:** For icon-only interactive elements (like custom checkboxes or back-to-top buttons), `aria-label` is crucial for screen readers, but it doesn't help sighted users who may not understand the icon's meaning. Additionally, when using the "checkbox hack" for things like mobile menus, placing the `aria-label` on the visual `<label>` is incorrect; screen readers expect the accessible name on the hidden `<input type="checkbox">` itself. Finally, decorative SVGs used within links that already have accessible text (like social links) should have `aria-hidden="true"` to prevent redundant "graphic" announcements.
**Action:** 1. Always place `aria-label` on the interactive element (e.g., `<input>`), not its visual label or wrapper. 2. Add `title` attributes to icon-only buttons or ambiguous icons to provide native tooltips for sighted users. 3. Add `aria-hidden="true"` to decorative SVGs within links or buttons to reduce screen reader noise.
## 2026-10-31 - Checkbox Hack Accessibility
**Learning:** For accessible 'checkbox hack' implementations (e.g., mobile navigation via hidden checkbox), the `aria-label` must be placed directly on the `<input type="checkbox">` element, not its visual `<label>`, to ensure proper screen reader announcements. Adding `title` attributes to icon-only buttons provides native tooltips for sighted users.
**Action:** Always check ARIA label placement for hidden inputs acting as toggles, and use `title` attributes for icon-only interactions.
## 2026-06-03 - Escape Hatches for 404 Pages
**Learning:** 404 pages and empty states can become frustrating dead-ends for users. By providing an escape hatch, such as a link back to the homepage, we allow the user to continue navigating rather than leaving the site or feeling stuck. This simple addition makes the user experience significantly better.
**Action:** Always include a clear call-to-action or escape hatch (like a link to the homepage or search bar) on error pages and empty states to prevent user dead-ends.

## 2026-11-01 - 404 Page Escape Hatches
**Learning:** A 404 page without clear next steps creates a dead end for users, leading to frustration and abandonment. A simple link back to the homepage provides an essential "escape hatch," significantly improving the user experience during an error state.
**Action:** Always ensure that error states (like 404 pages) and empty states include a clear, actionable path forward, such as a link to the homepage or main dashboard.
## 2026-06-05 - 404 Page Escape Hatch
**Learning:** Dead-end states like 404 pages disrupt user flow and cause frustration if they offer no way out. Providing an explicit escape hatch is critical to good UX.
**Action:** Always provide a clear, visible link to the homepage or a relevant starting point on error pages or empty states to prevent user dead-ends.

## 2026-05-24 - Empty State Escape Hatches
**Learning:** A 404 page acts as an empty state. Without a clear path forward, it acts as a "dead-end" that can frustrate users and increase bounce rates.
**Action:** Always provide an explicit, helpful call-to-action (like returning to the homepage) in error pages and empty states to guide users back to the primary flow.

## 2026-11-04 - Clear Escape Hatches
**Learning:** When users hit a dead-end like a 404 page or an empty search results state, it can be frustrating and may lead to them abandoning the site.
**Action:** Always provide a clear "escape hatch" in dead-end states, such as a prominent link back to the homepage or primary navigation area, to help users recover quickly.

## 2026-11-10 - Home Page Empty State
**Learning:** A homepage listing posts can act as an empty state if there are no posts yet. Without an explicit message, users might think the site is broken or still loading.
**Action:** Always provide an explicit empty state message (like "No posts found. Check back later!") for dynamic lists on the homepage to reassure users.
