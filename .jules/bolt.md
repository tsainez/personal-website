# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2025-02-17 - Scroll Performance & Layout Thrashing
**Learning:** Accessing layout properties like `scrollHeight` and `clientHeight` inside scroll event handlers forces synchronous layout calculation on every frame, causing jank.
**Action:** Cache these values and update them using `ResizeObserver` on `document.body` (to detect content changes) and `window.resize`. This reduces layout reads from O(N) to O(1) during scrolling. Use Playwright to instrument `HTMLElement.prototype` to verify the reduction in layout property accesses.
