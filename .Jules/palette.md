## 2025-05-18 - Skip to Content Links in Jekyll Themes
**Learning:** Default Jekyll themes like `minima` often lack "skip to main content" links, which are a critical accessibility feature.
**Action:** When customizing Jekyll sites, always verify if a skip link exists. If not, override the `default.html` layout (and any other root layouts) to include one, and ensure the target element (usually `<main>`) has the corresponding ID. The CSS 'clip' pattern is a reliable way to hide it visually until focused.
