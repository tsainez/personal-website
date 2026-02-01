# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-16 - Active Page Indication
**Learning:** Adding `aria-current="page"` to navigation links is a low-effort, high-impact accessibility win that provides screen reader users with critical context (knowing "where they are"). It also serves as a robust hook for visual styling (`[aria-current="page"]`), enforcing a 1:1 mapping between semantic state and visual presentation.
**Action:** When iterating on navigation menus in Jekyll, use the `page.url` vs `link.url` comparison pattern to automate this state, avoiding manual per-page overrides.
