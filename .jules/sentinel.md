## 2025-02-21 - [DOM Clobbering in Custom Search]
**Vulnerability:** The client-side search implementation dynamically generated HTML to display search results by concatenating unescaped user input directly into `innerHTML` (`resultsContainer.innerHTML += '<div>' + query + '</div>'`).
**Learning:** `innerHTML` is inherently dangerous when processing any data originating from the user or the URL (like query parameters), as it will execute any embedded scripts.
**Prevention:** Avoid `innerHTML` whenever possible. Use `textContent` or `innerText` to safely set text, or utilize modern DOM APIs like `document.createElement` and `element.append()` to construct UI elements safely.

## 2025-03-05 - [Unescaped Output in Liquid Templates]
**Vulnerability:** A blog post template used `{{ page.title }}` without any escaping within an HTML tag (e.g., `<h1 id="{{ page.title }}">`). A crafted title in the frontmatter containing double quotes could break out of the attribute and inject an `onload` or `onerror` handler, leading to Stored XSS.
**Learning:** Liquid templates, by default, do not escape output. When injecting variables into HTML attributes, you must assume the input could contain characters that break the HTML syntax.
**Prevention:** Always use the `escape` filter for variables placed inside HTML attributes: `{{ page.title | escape }}`.

## 2025-03-12 - [Unescaped Output in Liquid Templates (URLs)]
**Vulnerability:** A navigation menu used `{{ link.url }}` directly in the `href` attribute. While typical URLs are safe, a malicious or malformed URL (e.g., `javascript:alert(1)`) or one containing quotes could lead to XSS.
**Learning:** Similar to general attributes, URLs in `href` or `src` attributes need escaping, but also require validation against the `javascript:` pseudo-protocol if the URL is entirely user-controlled. For internal, trusted config, escaping is usually sufficient.
**Prevention:** For internal links defined in config/frontmatter, use `escape`: `href="{{ link.url | escape }}"`. If the URL might contain special characters that need percent-encoding, use `cgi_escape`.

## 2025-04-10 - [Stored XSS via Liquid Output in URL Attributes]
**Vulnerability:** An author's social link was constructed as `<a href="{{ author.website }}">`. An attacker with commit access could change their website in `_data/authors.yml` to `javascript:alert('XSS')`.
**Learning:** Even data from `_data/` files should be treated with caution if multiple people can edit them.
**Prevention:** For URLs that might be user-provided, consider validating the protocol (e.g., ensuring it starts with `http://` or `https://`) in addition to escaping.

## 2025-04-15 - [Stored XSS via Liquid Output in Attributes]
**Vulnerability:** Variables passed through the `relative_url` filter in Jekyll (e.g., `post.url | relative_url`) allowed for Stored XSS via attribute breakout when injected into HTML attributes like `href`.
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

## 2026-07-18 - Frame Busting Clickjacking Bypass
**Vulnerability:** The client-side frame-busting logic in `security.js` attempted to hide the page by manipulating the DOM (`document.documentElement.innerHTML = ''`), which relies on scripts executing. If an attacker frames the site in an iframe using the `sandbox` attribute (e.g., `sandbox="allow-forms"` without `allow-scripts`), the script doesn't execute and the site renders normally, exposing it to clickjacking.
**Learning:** Security controls that rely on JavaScript execution fail closed (insecurely) if scripts are disabled or blocked by sandboxing.
**Prevention:** Implement the OWASP-recommended frame-busting mechanism: securely hide the body by default using an inline CSS style (`<style id="antiClickjack">body{display:none !important;}</style>`), allow this style through CSP using a SHA-256 hash, and only remove it via JavaScript if `window.self === window.top`.
