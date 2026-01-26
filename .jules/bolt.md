# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2024-05-22 - Scroll Handler Optimization
**Learning:** Accessing `scrollHeight` and `clientHeight` inside a scroll event listener (even when throttled with `requestAnimationFrame`) causes unnecessary layout thrashing/reflows on every frame.
**Action:** Cache layout dimensions and update them using `ResizeObserver` (with a window resize fallback), ensuring the critical scroll path only reads cached values and cheap properties like `scrollTop`.
