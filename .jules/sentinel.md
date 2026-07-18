## 2025-02-19 - Content Security Policy for Jekyll
**Vulnerability:** Missing Content Security Policy (CSP) and unescaped site configuration variables.
**Learning:** Jekyll themes hide layout files. Overriding '_includes/head.html' is the best way to apply global headers like CSP. However, some layouts (like 'onepager.html' in this repo) might not use the standard 'head.html' include and define their own <head>, requiring manual updates. Also, 'pnpm test' prompts can be misleading in a Ruby repo; always check the actual tech stack (Gemfile).
**Prevention:** Always check all layout files to see if they include 'head.html' or define their own head. Verify toolchain (Ruby vs Node) before creating tests.

## 2025-02-19 - [Stored XSS in Jekyll Templates]
**Vulnerability:** Jekyll templates (`_layouts/home.html`, `_layouts/post.html`) outputted `page.title`, `page.list_title`, and `page.author` without escaping, allowing Stored XSS if malicious content is injected into front matter.
**Learning:** Liquid templates do not auto-escape output. Developers must explicitly use the `| escape` filter for any variable that could contain user input or is rendered into HTML attributes/text.
**Prevention:** Audit all Liquid output tags (`{{ ... }}`) and ensure `| escape` is applied unless raw HTML is explicitly intended and safe.

## 2025-02-20 - [HTML Parsing: Regex vs Nokogiri]
**Vulnerability:** Regex-based HTML modification in plugins missed edge cases (unquoted attributes, case sensitivity, spacing).
**Learning:** Even complex regexes are fragile against valid HTML variations. `Nokogiri` provides robust parsing but requires careful handling of document fragments vs full documents to avoid stripping tags.
**Prevention:** Avoid regex for HTML manipulation. Use `Nokogiri::HTML.parse` for full docs and `Nokogiri::HTML::DocumentFragment.parse` for fragments.

## 2025-02-21 - [Stored XSS via Liquid Output in HTML Attributes]
**Vulnerability:** Unescaped Liquid output variables in standard HTML attributes (e.g., `lang` in `_layouts/default.html`) allow for Stored XSS via attribute breakout.
**Learning:** Jekyll Liquid templates do not auto-escape output. User-controlled variables injected into standard HTML attributes must use the `| escape` filter to prevent malicious code from breaking out of the attribute context and executing scripts.
**Prevention:** Always audit Jekyll templates for raw variable output inside HTML attributes and apply `| escape` to mitigate Stored XSS risks.

## 2025-02-21 - [Stored XSS in URL Parameters via Liquid Output]
**Vulnerability:** Unescaped Liquid output variables (`mst.username`, `site.googleplus_username`, and `page.lang`) in layout files (`_layouts/default.html`, `_includes/social.html`) allowed for Stored XSS if malicious content was entered in configuration or front matter, particularly when injected directly into attributes or URLs.
**Learning:** When generating dynamic URLs in Jekyll templates, developers must explicitly use the `| cgi_escape | escape` filter chain for variables injected into the URL path or query string. Just `| escape` is not enough for URLs, and unescaped variables like `page.lang` can lead to attribute injection.
**Prevention:** Always audit Jekyll templates for raw variable output in attributes and URLs. Apply `| cgi_escape | escape` to variables in URLs, and `| escape` to general attribute variables.

## 2025-02-21 - [Stored XSS via relative_url in Jekyll]
**Vulnerability:** Unescaped variables passed through the `relative_url` filter in Jekyll (e.g., `post.url | relative_url`) allowed for Stored XSS via attribute breakout when injected into HTML attributes like `href`.
**Learning:** The `relative_url` filter in Jekyll does not automatically HTML-escape its output. If the input variable is user-controlled (e.g., a `permalink` in frontmatter), malicious characters can break out of the HTML attribute and execute arbitrary scripts.
**Prevention:** Always append the `| escape` filter after `relative_url` (e.g., `{{ page.url | relative_url | escape }}`) when the resulting URL is used within an HTML attribute.

## 2025-05-18 - [Security.txt for Static Sites]
**Vulnerability:** Missing `security.txt` file means security researchers have no standard way to report vulnerabilities.
**Learning:** Even static sites (Jekyll) need a vulnerability disclosure policy. In Jekyll, dotfiles/folders like `.well-known` are excluded by default and must be explicitly added to `include` in `_config.yml`.
**Prevention:** Always check if standard security paths (`.well-known`) are included in the build output for static site generators.

## 2025-05-22 - [Regex-based Link Protection Gaps]
**Vulnerability:** External link protection missed protocol-relative URLs (`//example.com`) and links with `target` before `href`.
**Learning:** Regex-based HTML parsing is brittle. Simple patterns like `http|https` miss `//`. Fixed attribute order in regexes creates blind spots.
**Prevention:** When using regex for HTML, explicitly test for protocol-relative URLs and variable attribute ordering/spacing.

## 2025-07-15 - Strict CSP Implementation
**Vulnerability:** Weak CSP allowing 'unsafe-inline' for scripts, increasing XSS risk.
**Learning:** Google Analytics snippets often require 'unsafe-inline'. In this project, GA is disabled, allowing for a stricter policy. Enabling it later will require refactoring or nonces.
**Prevention:** Maintained strict policy (no 'unsafe-inline' for scripts) and added comments to warn future developers about GA dependency.

## 2025-10-27 - [Clickjacking Protection on Static Sites]
**Vulnerability:** GitHub Pages does not support `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers, leaving the site vulnerable to Clickjacking.
**Learning:** Security headers that prevent framing cannot be set via `<meta>` tags (specifically `frame-ancestors`). The only viable mitigation for static hosting without header control is JavaScript-based "Frame Busting".
**Prevention:** Implemented `security.js` with a frame-busting script and included it in `<head>`. This is an imperfect but necessary workaround for this environment.

## 2026-02-09 - [Stored XSS via Liquid Output]
**Vulnerability:** Unescaped Liquid output variables (`page.title`, `page.author`, `site.email`) in layout files (`_layouts/home.html`, `_layouts/post.html`, `_includes/footer.html`) allowed for Stored XSS if malicious content was entered in configuration or front matter.
**Learning:** Jekyll's default output `{{ variable }}` does NOT automatically escape HTML. This is a common pitfall compared to some other template engines. Developers must explicitly use the `| escape` filter for any user-controlled or potentially unsafe data.
**Prevention:** Always audit Jekyll templates for raw variable output and apply `| escape` by default, especially for variables that might be influenced by external contributors.

## 2026-05-14 - [Stored XSS via Liquid Output in URL attributes]
**Vulnerability:** Unescaped Liquid output variables (`site.email` and `site.github_username`) in Markdown files (`image-map.markdown`) allowed for Stored XSS if malicious content was entered in configuration, particularly when injected directly into attributes or URLs.
**Learning:** In Jekyll, Markdown files with front matter parse Liquid tags before rendering HTML. Any user-controlled configuration variables (like `site.email` or `site.github_username`) injected into HTML attributes within these content files must be explicitly escaped (e.g., using `escape` or `cgi_escape`) to prevent Stored XSS.
**Prevention:** Always audit Jekyll content files for raw variable output in attributes and URLs. Apply `| cgi_escape | escape` to variables in URLs, and `| escape` to general attribute variables.

## 2026-05-25 - [Stored XSS via Liquid Output in URL Attributes]
**Vulnerability:** Unescaped Liquid output variables for URLs (e.g., `page.url`, `post.url`, `my_page.url`) were directly injected into HTML attributes (like `href`) in layout files (`_layouts/home.html`, `_layouts/post.html`, `_includes/header.html`). If a crafted `permalink` were defined in the front matter, it could lead to attribute breakout and Stored XSS.
**Learning:** Liquid template engines, unlike some others, do not auto-escape their output by default. Any variable injected into an HTML attribute, including path or URL variables generated from potentially user-controllable input (like front matter), needs to be explicitly escaped.
**Prevention:** Always append the `| escape` filter for any Liquid variable injected into HTML attributes unless it is strictly hardcoded and trusted.

## 2026-05-25 - [Stored XSS via Liquid Output in URL Attributes]
**Vulnerability:** Unescaped Liquid output variables for URLs (e.g., `page.url`, `post.url`, `my_page.url`, and literal paths passed to `relative_url`) were directly injected into HTML attributes (like `href`, `src`, `xlink:href`) in layout files (`_layouts/onepager.html`, `_includes/head.html`, `_includes/footer.html`, `_includes/social.html`, `image-map.markdown`). If a crafted `baseurl` or `permalink` were defined in the front matter or configuration, it could lead to attribute breakout and Stored XSS.
**Learning:** Liquid template engines do not auto-escape their output by default. Any variable injected into an HTML attribute, including path or URL variables generated from potentially user-controllable input (like front matter or config like `site.baseurl` used by `relative_url`), needs to be explicitly escaped.
**Prevention:** Always append the `| escape` filter for any Liquid variable injected into HTML attributes unless it is strictly hardcoded and trusted.

## 2026-05-28 - [Regex-based Link Protection Gaps Bypass via Whitespace and Case Variations]
**Vulnerability:** The `external_links.rb` plugin relied on `href` prefixes matching exactly without trailing spaces, and used a case-sensitive target="_blank" Nokogiri selector (`[target="_blank"]`). This allowed evasion by prefixing URLs with whitespace (e.g. `href=" https://evil.com"`) or by using alternative casing like `target="_BLANK"`.
**Learning:** Regex and CSS matchers without normalization are susceptible to bypasses because browsers are more lenient with whitespaces and casing. For attributes, Nokogiri requires XPath queries with `translate` to match case-insensitively. URLs must be stripped before validation.
**Prevention:** Always strip leading/trailing whitespace before regex matching for URLs or similar attributes, and use XPath `translate` for case-insensitive matching of attribute values in Nokogiri.

## 2026-06-03 - [Case-Sensitive Filter Bypass in Nokogiri]
**Vulnerability:** The external links plugin relied on Nokogiri's `a[target="_blank"]` CSS selector, which is strictly case-sensitive. This meant links authored with `target="_BLANK"` bypassed the filter and were not assigned `rel="noopener noreferrer"`, leaving them vulnerable to reverse tabnabbing.
**Learning:** HTML attribute values like `target` are often treated case-insensitively by browsers but are evaluated strictly by parser selectors unless specifically configured. In Nokogiri, CSS selectors are case-sensitive.
**Prevention:** Replaced the CSS selector with an XPath query using the `translate()` function to enforce case-insensitive matching (`//a[translate(@target, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="_blank"]`), ensuring consistent and robust protection regardless of authored case.

## 2026-06-14 - [Incomplete Frame-Busting Protection Bypass]
**Vulnerability:** The existing frame-busting logic in `security.js` attempted to hide the page by clearing the document (`document.documentElement.innerHTML = ''`). However, because the script executed in the `<head>` during document parsing, the browser continued parsing and appending the `<body>` to the cleared DOM, rendering the site content anyway. An attacker could bypass the protection by loading the site in a sandboxed iframe (`sandbox="allow-scripts"`), which prevents the redirect while still displaying the content, leaving the site vulnerable to clickjacking.
**Learning:** Clearing the DOM synchronously during `<head>` parsing does not halt the browser's HTML parser. To reliably hide content during frame-busting, one must unconditionally hide the root element using CSS (e.g., `document.documentElement.style.display = 'none'`) before validating the top-level window, and only restore visibility if the check passes.
**Prevention:** Implement robust frame-busting by hiding the document via `style.display = 'none'` unconditionally, then restoring it only if `window.self === window.top`. Never rely on synchronous DOM mutation to stop HTML parsing.
