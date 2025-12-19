## 2025-02-19 - Content Security Policy for Jekyll
**Vulnerability:** Missing Content Security Policy (CSP) and unescaped site configuration variables.
**Learning:** Jekyll themes hide layout files. Overriding '_includes/head.html' is the best way to apply global headers like CSP. However, some layouts (like 'onepager.html' in this repo) might not use the standard 'head.html' include and define their own <head>, requiring manual updates. Also, 'pnpm test' prompts can be misleading in a Ruby repo; always check the actual tech stack (Gemfile).
**Prevention:** Always check all layout files to see if they include 'head.html' or define their own head. Verify toolchain (Ruby vs Node) before creating tests.

## 2025-07-15 - Strict CSP Implementation
**Vulnerability:** Weak CSP allowing 'unsafe-inline' for scripts, increasing XSS risk.
**Learning:** Google Analytics snippets often require 'unsafe-inline'. In this project, GA is disabled, allowing for a stricter policy. Enabling it later will require refactoring or nonces.
**Prevention:** Maintained strict policy (no 'unsafe-inline' for scripts) and added comments to warn future developers about GA dependency.
