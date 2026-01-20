# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2026-01-20 - Anchor Link Affordance
**Learning:** Replacing text-based characters (like '#') with SVG icons significantly improves visual polish and affordance for interactive elements. When injecting icons via JavaScript, ensure `aria-hidden="true"` is set on the SVG to prevent screen readers from announcing it as "image" or reading internal paths, while keeping the parent button's `aria-label` for context.
**Action:** Use `inline-flex` and `align-items: center` on the parent button to ensure the SVG icon aligns perfectly with the text baseline or container.
