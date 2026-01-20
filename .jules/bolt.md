# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2024-05-23 - DOM Injection Bottleneck
**Learning:** `assets/js/anchor-links.js` was synchronously creating and appending DOM elements for every header on the page during `DOMContentLoaded`. On long pages, this increases Total Blocking Time (TBT).
**Action:** Implemented `IntersectionObserver` to lazy-load these interactive elements only when they approach the viewport, reducing initial DOM size and script execution time.
