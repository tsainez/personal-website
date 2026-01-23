# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2024-10-24 - Layout Thrashing in Scroll Handlers
**Learning:** Accessing `scrollHeight` or `clientHeight` inside a `scroll` event listener forces a synchronous layout calculation (reflow) on every frame, significantly degrading scroll performance.
**Action:** Cache layout metrics and update them using `ResizeObserver` (observing `document.body`) and the `resize` event. Use the cached values inside the scroll loop to decouple layout reads from the scroll update frequency.
