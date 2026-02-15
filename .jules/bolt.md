# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2025-02-18 - Scroll Event Layout Thrashing
**Learning:** Reading layout properties (like `scrollHeight` and `clientHeight`) inside a scroll event handler causes forced reflows on every frame, even when throttled with `requestAnimationFrame`.
**Action:** Cache layout dimensions outside the scroll handler and use `ResizeObserver` to update them only when the layout actually changes. This eliminates layout reads during the critical scroll path.
