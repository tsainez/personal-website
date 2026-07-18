/**
 * 🛡️ Sentinel: Frame Busting Protection
 * Prevents the site from being loaded within an iframe to mitigate Clickjacking attacks.
 * This is necessary because GitHub Pages does not support X-Frame-Options or CSP frame-ancestors headers.
 *
 * IMPROVED DEFENSE (OWASP Recommended):
 * 1. An inline `<style id="antiClickjack">body{display:none !important;}</style>` hides the body by default.
 * 2. Checks if the window is top-level.
 * 3. If top-level, removes the style element, revealing the content.
 * 4. If framed, attempts to bust out (redirect top window). If redirection fails (e.g. sandboxed), content remains hidden.
 */
(function() {
  if (window.self === window.top) {
      var antiClickjack = document.getElementById("antiClickjack");
      if (antiClickjack) {
          antiClickjack.parentNode.removeChild(antiClickjack);
      }
  } else {
      try {
          window.top.location = window.self.location;
      } catch (e) {
          console.warn('Sentinel: Failed to break frame. Site is likely running in a sandboxed iframe. Content remains hidden for protection.');
      }
  }
})();
