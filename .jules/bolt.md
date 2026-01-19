# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2026-01-19 - [Lazy Loading Anchor Links]
**Learning:** Lazy loading interactive elements (like anchor links) using `IntersectionObserver` significantly reduces initial DOM nodes on long pages, but requires careful verification of viewport margins in tests to ensure "lazy" behavior is actually triggered.
**Action:** Use `rootMargin` effectively and verify viewport sizing in Playwright tests when testing lazy loading.
