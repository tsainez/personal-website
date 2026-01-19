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

## 2026-01-19 - [Preventing Stored XSS in Jekyll Templates]
**Vulnerability:** Unescaped `page.*` variables in Jekyll layouts (specifically `lang`, `author`, `title`, `list_title`).
**Learning:** Liquid templates default to raw output (`{{ variable }}`). Even for static sites, content originating from "trusted" front matter should be treated as untrusted if the repository accepts external contributions (PRs). Malicious front matter can inject arbitrary HTML/JS.
**Prevention:** Always use the `| escape` filter for any variable output into HTML attributes or text content, unless raw HTML is explicitly intended and sanitized.
