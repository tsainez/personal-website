# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2026-01-15 - [Event Delegation for Anchors]
**Learning:** `assets/js/anchor-links.js` was attaching listeners to every header, which scales linearly (O(N)). Switching to event delegation (O(1)) reduced memory usage and initialization time, especially for long posts.
**Action:** Always prefer event delegation for repeated elements like lists, table rows, or dynamically generated buttons.
