# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Project Setup]
**Learning:** This is a Jekyll static site using the Minima theme. Performance optimizations should focus on frontend assets (images, CSS, JS) and HTML structure (lazy loading, defer attributes).
**Action:** Focus on `_includes`, `_layouts`, and `assets` for optimization opportunities.

## 2024-05-22 - DOM Manipulation Optimization
**Learning:** Creating unique `@keyframes` and `<style>` tags for every animated element is a major performance bottleneck (O(N) style tags).
**Action:** Use CSS variables to parameterize a single shared `@keyframes` definition, reducing style tags to O(1) and significantly improving layout performance. Also, batch DOM insertions using `DocumentFragment`.

## 2025-05-22 - Scroll Listener Replacement
**Learning:** Even throttled scroll listeners cause main thread overhead. Using `IntersectionObserver` with an invisible "sentinel" element (absolute positioned at top) provides a jank-free way to toggle UI elements based on scroll position without polling.
**Action:** Replace `window.onscroll` with `IntersectionObserver` observing injected sentinels for scroll-triggered visibility toggles.
## 2025-02-18 - Scroll Event Layout Thrashing
**Learning:** Reading layout properties (like `scrollHeight` and `clientHeight`) inside a scroll event handler causes forced reflows on every frame, even when throttled with `requestAnimationFrame`.
**Action:** Cache layout dimensions outside the scroll handler and use `ResizeObserver` to update them only when the layout actually changes. This eliminates layout reads during the critical scroll path.

## 2025-02-19 - Layout vs Composite Animations on Scroll
**Learning:** Animating geometry properties like `width` during scroll events forces the browser to recalculate layout and repaint on every frame, which is extremely expensive on the main thread.
**Action:** Always animate using GPU-composited properties (like `transform: scaleX`) and `will-change: transform`. Set `width: 100%` and scale it from `0` to `1`. This offloads the work to the GPU and avoids main thread layout thrashing.

## 2026-05-12 - Nokogiri Parsing Optimization in Jekyll Plugins
**Learning:** Parsing full HTML documents with Nokogiri during Jekyll's `post_render` phase is extremely slow and significantly impacts build times. A large percentage of pages might not even contain the elements the plugin is looking for.
**Action:** Use a fast, built-in Ruby Regex (e.g., `raw_html.match?(/<a[^>]+href\s*=\s*['"]?(?:https?:|\/\/)/i)`) to perform a cheap string check first. If the target elements aren't present, return early to bypass Nokogiri completely, drastically reducing overall site generation time.

## 2026-05-19 - Resize Event Layout Thrashing
**Learning:** Resize events can fire rapidly. Recalculating document height on every resize event causes severe layout thrashing (forced synchronous layout), especially when reading properties like `scrollHeight` and `clientHeight`.
**Action:** Debounce resize events so that layout properties are only calculated once the user has finished resizing, drastically reducing layout thrashing.

## 2026-05-24 - Text Extraction Layout Thrashing
**Learning:** Reading `innerText` forces a synchronous layout calculation (reflow) because it is layout-aware (e.g., it ignores elements with `display: none` and respects CSS styling). When copying text from large code blocks on complex pages, this causes significant main thread blocking and layout thrashing.
**Action:** Use `textContent` instead of `innerText` when extracting text from syntax-highlighted code blocks or when layout-aware text extraction isn't strictly necessary. `textContent` directly reads DOM text nodes without invoking the styling/layout engine, which is orders of magnitude faster.

## 2026-06-06 - Large String Allocation Optimization
**Learning:** Performing string prefix checks on large strings (such as `doc.output` in Jekyll) using `lstrip.start_with?` allocates massive duplicate strings in memory, causing significant garbage collection overhead.
**Action:** Always use the highly optimized `String#match?` method with a regular expression (like `/\A\s*(?:<!DOCTYPE|<html)/i`) to evaluate the string in-place with minimal garbage collection overhead.
