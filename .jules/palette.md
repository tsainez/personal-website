# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-07-16 - Making CSS Checkbox Hacks Accessible
**Learning:** The common "checkbox hack" for mobile menus is inaccessible by default. However, it can be progressively enhanced with a small amount of JS to handle `aria-expanded` and keyboard events (Enter/Space) on the label, without rewriting the entire CSS architecture.
**Action:** When encountering legacy CSS hacks, wrap them in semantic ARIA roles (`role="button"`) and add "sprinkles" of JS for state management rather than forcing a full refactor.
