## 2025-05-18 - Copy Code Accessibility
**Learning:** Changing visual text (like "Copy" -> "Copied!") is not enough for accessibility if `aria-label` is present, as screen readers prioritize the label.
**Action:** When updating button state visually, always update the `aria-label` to match or provide equivalent feedback, ensuring the status change is communicated to screen reader users.
