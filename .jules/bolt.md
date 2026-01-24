# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2026-01-24 - Scroll Performance & ResizeObserver
**Learning:** Reading expensive layout properties (`scrollHeight`, `clientHeight`) in a scroll event listener triggers potential layout thrashing on every frame, even with rAF.
**Action:** Cache layout metrics and update them via `ResizeObserver` (on `document.body`) and `window.resize`. This separates the "read" (layout) phase from the "write" (style update) phase, ensuring O(1) performance during the critical scroll path.
