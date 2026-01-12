## 2025-05-18 - Skip to Content Links in Jekyll Themes
**Learning:** Default Jekyll themes like `minima` often lack "skip to main content" links, which are a critical accessibility feature.
**Action:** When customizing Jekyll sites, always verify if a skip link exists. If not, override the `default.html` layout (and any other root layouts) to include one, and ensure the target element (usually `<main>`) has the corresponding ID. The CSS 'clip' pattern is a reliable way to hide it visually until focused.

## 2025-05-20 - Programmatic Focus on Non-Interactive Elements
**Learning:** Calling `.focus()` on `document.body` (or other non-interactive containers) silently fails in many contexts unless the element explicitly has `tabindex="-1"`. This leaves screen reader users stranded at the bottom of the page after actions like "Back to Top".
**Action:** When managing focus programmatically to a container (like resetting view to top), dynamically add `tabindex="-1"` before focusing, and optionally remove it on blur to keep the DOM clean.

## 2025-05-18 - Copy Code Feedback for Screen Readers
**Learning:** Simply changing `innerText` from "Copy" to "Copied!" is not enough for screen readers if an `aria-label` is present, as `aria-label` overrides inner text.
**Action:** When providing status feedback on a button that has an `aria-label`, you must also update the `aria-label` (e.g., "Copied successfully") to ensure the new state is announced.

## 2025-05-24 - Post Navigation Context
**Learning:** Standard "Next/Previous" post links often just use the post title as the link text. For screen reader users, "Title of Post" in isolation is less helpful than "Previous post: Title of Post". Also, decorative arrows (`«`, `»`) are often read out as "left-pointing double angle quotation mark" which adds noise.
**Action:** Use `aria-label` to provide context (e.g., "Next post: [Title]") and wrap decorative text characters in `<span aria-hidden="true">` to clean up the auditory experience.
