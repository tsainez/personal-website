## 2025-05-18 - Skip to Content Links in Jekyll Themes
**Learning:** Default Jekyll themes like `minima` often lack "skip to main content" links, which are a critical accessibility feature.
**Action:** When customizing Jekyll sites, always verify if a skip link exists. If not, override the `default.html` layout (and any other root layouts) to include one, and ensure the target element (usually `<main>`) has the corresponding ID. The CSS 'clip' pattern is a reliable way to hide it visually until focused.

## 2025-05-20 - Programmatic Focus on Non-Interactive Elements
**Learning:** Calling `.focus()` on `document.body` (or other non-interactive containers) silently fails in many contexts unless the element explicitly has `tabindex="-1"`. This leaves screen reader users stranded at the bottom of the page after actions like "Back to Top".
**Action:** When managing focus programmatically to a container (like resetting view to top), dynamically add `tabindex="-1"` before focusing, and optionally remove it on blur to keep the DOM clean.
## 2025-05-18 - Copy Code Feedback for Screen Readers
**Learning:** Simply changing `innerText` from "Copy" to "Copied!" is not enough for screen readers if an `aria-label` is present, as `aria-label` overrides inner text.
**Action:** When providing status feedback on a button that has an `aria-label`, you must also update the `aria-label` (e.g., "Copied successfully") to ensure the new state is announced.

## 2025-07-15 - Decorative Arrows in Navigation
**Learning:** Using characters like `&laquo;` and `&raquo;` for navigation links (e.g., Previous/Next post) creates noise for screen reader users ("Left double angle quote").
**Action:** Always wrap decorative characters in `<span aria-hidden="true">` and provide a clear `aria-label` on the anchor tag that describes the destination (e.g., "Previous post: [Title]").
