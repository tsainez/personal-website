## 2025-05-18 - Copy Code Feedback for Screen Readers
**Learning:** Simply changing `innerText` from "Copy" to "Copied!" is not enough for screen readers if an `aria-label` is present, as `aria-label` overrides inner text.
**Action:** When providing status feedback on a button that has an `aria-label`, you must also update the `aria-label` (e.g., "Copied successfully") to ensure the new state is announced.
