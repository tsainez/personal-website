# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2024-05-22 - Layout Thrashing in Scroll Handlers
**Learning:** Even with `requestAnimationFrame` throttling, accessing `scrollHeight` or `clientHeight` inside a scroll handler forces a layout recalculation on every frame (O(N) layout reads).
**Action:** Cache layout dimensions (e.g., `maxScroll`) and update them only on `resize` or using `ResizeObserver`. This reduces layout reads to O(1) during scroll events.
