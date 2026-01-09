/**
 * 🛡️ Sentinel: Frame Busting Protection
 * Prevents the site from being loaded within an iframe to mitigate Clickjacking attacks.
 * This is necessary because GitHub Pages does not support X-Frame-Options or CSP frame-ancestors headers.
 *
 * IMPROVED DEFENSE:
 * 1. Checks if the window is top-level.
 * 2. If framed, immediately REMOVES all content from the document to prevent the UI from being shown.
 *    This is compatible with strict CSP (no inline styles).
 * 3. Then attempts to bust out (redirect top window).
 */
(function() {
  if (window.self !== window.top) {
      // In a frame!

      // 1. Hide everything immediately by clearing the document.
      // This prevents the user from seeing or interacting with the framed site.
      // We assume that if we are framed, we don't want to show anything unless we can successfully bust out.
      document.documentElement.innerHTML = '';

      // 2. Attempt to bust out
      try {
          // Attempt redirect directly.
          // Writing to window.top.location is allowed even cross-origin (navigation),
          // unless blocked by sandbox ('allow-top-navigation').
          // Reading window.top.location properties (like hostname) throws SecurityError if cross-origin.
          // So we skip reading and just try to write.
          window.top.location = window.self.location;
      } catch (e) {
          // If sandbox blocks navigation, we catch the error.
          // The content remains hidden (removed), so the user is protected.
          console.warn('Sentinel: Failed to break frame. Site is likely running in a sandboxed iframe. Content removed for protection.');
      }
  }
})();
