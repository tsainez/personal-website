## 2025-02-19 - Content Security Policy for Jekyll
**Vulnerability:** Missing Content Security Policy (CSP) and unescaped site configuration variables.
**Learning:** Jekyll themes hide layout files. Overriding '_includes/head.html' is the best way to apply global headers like CSP. However, some layouts (like 'onepager.html' in this repo) might not use the standard 'head.html' include and define their own <head>, requiring manual updates. Also, 'pnpm test' prompts can be misleading in a Ruby repo; always check the actual tech stack (Gemfile).
**Prevention:** Always check all layout files to see if they include 'head.html' or define their own head. Verify toolchain (Ruby vs Node) before creating tests.

## 2025-07-15 - Strict CSP Implementation
**Vulnerability:** Weak CSP allowing 'unsafe-inline' for scripts, increasing XSS risk.
**Learning:** Google Analytics snippets often require 'unsafe-inline'. In this project, GA is disabled, allowing for a stricter policy. Enabling it later will require refactoring or nonces.
**Prevention:** Maintained strict policy (no 'unsafe-inline' for scripts) and added comments to warn future developers about GA dependency.

## 2025-05-18 - [Security.txt for Static Sites]
**Vulnerability:** Missing `security.txt` file means security researchers have no standard way to report vulnerabilities.
**Learning:** Even static sites (Jekyll) need a vulnerability disclosure policy. In Jekyll, dotfiles/folders like `.well-known` are excluded by default and must be explicitly added to `include` in `_config.yml`.
**Prevention:** Always check if standard security paths (`.well-known`) are included in the build output for static site generators.

## 2025-10-27 - [Clickjacking Protection on Static Sites]
**Vulnerability:** GitHub Pages does not support `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers, leaving the site vulnerable to Clickjacking.
**Learning:** Security headers that prevent framing cannot be set via `<meta>` tags (specifically `frame-ancestors`). The only viable mitigation for static hosting without header control is JavaScript-based "Frame Busting".
**Prevention:** Implemented `security.js` with a frame-busting script and included it in `<head>`. This is an imperfect but necessary workaround for this environment.

## 2026-01-26 - Robust External Link Protection
**Vulnerability:** The regex in `_plugins/external_links.rb` was brittle, failing to detect `target="_blank"` if it appeared before `href` or if the URL was protocol-relative (`//`). This left some external links unprotected against Reverse Tabnabbing.
**Learning:** Regex for HTML parsing is inherently fragile. Security controls relying on attribute order in HTML tags are prone to bypass. Also, protocol-relative URLs (`//example.com`) are valid external links often missed by simple `http/s` checks.
**Prevention:** Use robust regex (or preferably HTML parsers) that are attribute-order independent. Always account for protocol-relative URLs when checking for external links. Added a regression test `tests/verify_external_links_plugin.rb` that mocks the Jekyll environment to verify the plugin logic.
