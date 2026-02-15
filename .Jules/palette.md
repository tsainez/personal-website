## 2025-05-18 - Skip to Content Links in Jekyll Themes
**Learning:** Default Jekyll themes like `minima` often lack "skip to main content" links, which are a critical accessibility feature.
**Action:** When customizing Jekyll sites, always verify if a skip link exists. If not, override the `default.html` layout (and any other root layouts) to include one, and ensure the target element (usually `<main>`) has the corresponding ID. The CSS 'clip' pattern is a reliable way to hide it visually until focused.

## 2025-05-20 - Programmatic Focus on Non-Interactive Elements
**Learning:** Calling `.focus()` on `document.body` (or other non-interactive containers) silently fails in many contexts unless the element explicitly has `tabindex="-1"`. This leaves screen reader users stranded at the bottom of the page after actions like "Back to Top".
**Action:** When managing focus programmatically to a container (like resetting view to top), dynamically add `tabindex="-1"` before focusing, and optionally remove it on blur to keep the DOM clean.

## 2025-05-18 - Copy Code Feedback for Screen Readers
**Learning:** Simply changing `innerText` from "Copy" to "Copied!" is not enough for screen readers if an `aria-label` is present, as `aria-label` overrides inner text.
**Action:** When providing status feedback on a button that has an `aria-label`, you must also update the `aria-label` (e.g., "Copied successfully") to ensure the new state is announced.

## 2025-05-21 - Accessible Post Navigation
**Learning:** When using decorative characters like `«` or `»` in links, screen readers may announce them awkwardly. It's better to wrap them in `aria-hidden="true"` and provide a robust `aria-label` for the link itself.
**Action:** For all "Previous/Next" navigation links, use `aria-label="Previous post: [Title]"` and hide decorative arrows from assistive technology.

## 2025-05-22 - External Link Indicators
**Learning:** Static site generators like Jekyll often lack a built-in way to distinguish external links, leading to user confusion about navigation context.
**Action:** Use a small, dependency-free JS utility to scan content areas (`.post-content`) for external hostnames and inject an icon + `.sr-only` text. This avoids regex-based build plugins which can be brittle and ensures consistent behavior across themes.
## 2025-05-23 - Context-Aware Anchor Links
**Learning:** Repeated interactive elements like "Copy link" buttons need unique accessible names to be useful. A generic "Copy link to section" label forces screen reader users to guess the context.
**Action:** Append the associated section title to the `aria-label` (e.g., "Copy link to section: Introduction") and ensure this specific label is restored after any temporary state changes (like "Copied!").
