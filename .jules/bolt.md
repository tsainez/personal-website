# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2026-01-17 - Event Delegation
**Learning:** Attaching event listeners to every element in a large collection (e.g., anchor links on every header) creates O(N) function instances and listener overhead.
**Action:** Use event delegation: attach a single listener to a common ancestor (like `document`) and identify targets via `e.target.closest(selector)`. This reduces memory usage and initialization time to O(1).
