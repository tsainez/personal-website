# Palette's Journal

## 2025-07-15 - Read Time Estimates
**Learning:** Adding a simple "X min read" estimate provides valuable context for users before they commit to clicking a link. It respects the user's time and is a standard pattern in modern blogs. Liquid's `number_of_words` filter makes this easy to implement without external plugins.
**Action:** When working with Jekyll themes, overriding layouts (like `home` and `post`) is a safe way to inject small features without modifying the theme gem directly.

## 2025-02-19 - Active Navigation State
**Learning:** Adding `aria-current="page"` to navigation links is a critical accessibility pattern that also enables easy CSS styling (e.g., `font-weight: bold`). This dual benefit reinforces the "design with accessibility in mind" philosophy.
**Action:** Always check navigation loops for active state logic and use `aria-current` instead of just a class.
