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

## 2025-05-22 - [Regex-based Link Protection Gaps]
**Vulnerability:** External link protection missed protocol-relative URLs (`//example.com`) and links with `target` before `href`.
**Learning:** Regex-based HTML parsing is brittle. Simple patterns like `http|https` miss `//`. Fixed attribute order in regexes creates blind spots.
**Prevention:** When using regex for HTML, explicitly test for protocol-relative URLs and variable attribute ordering/spacing.

## 2026-02-09 - [Stored XSS via Liquid Output]
**Vulnerability:** Unescaped Liquid output variables (`page.title`, `page.author`, `site.email`) in layout files (`_layouts/home.html`, `_layouts/post.html`, `_includes/footer.html`) allowed for Stored XSS if malicious content was entered in configuration or front matter.
**Learning:** Jekyll's default output `{{ variable }}` does NOT automatically escape HTML. This is a common pitfall compared to some other template engines. Developers must explicitly use the `| escape` filter for any user-controlled or potentially unsafe data.
**Prevention:** Always audit Jekyll templates for raw variable output and apply `| escape` by default, especially for variables that might be influenced by external contributors.
## 2025-02-20 - [HTML Parsing: Regex vs Nokogiri]
**Vulnerability:** Regex-based HTML modification in plugins missed edge cases (unquoted attributes, case sensitivity, spacing).
**Learning:** Even complex regexes are fragile against valid HTML variations. `Nokogiri` provides robust parsing but requires careful handling of document fragments vs full documents to avoid stripping tags.
**Prevention:** Avoid regex for HTML manipulation. Use `Nokogiri::HTML.parse` for full docs and `Nokogiri::HTML::DocumentFragment.parse` for fragments.
