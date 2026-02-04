# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2025-05-22 - Layout Thrashing in Scroll Handlers
**Learning:** Accessing `document.documentElement.scrollHeight` and `clientHeight` inside a scroll event handler (even if throttled) forces a synchronous layout recalculation (reflow) if the layout is dirty. This can cause significant main thread blocking during scrolling.
**Action:** Cache these expensive layout properties in variables and update them only when necessary (e.g., on `resize` events or using `ResizeObserver` on the body), rather than reading them on every scroll frame.
