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
  // Unconditionally hide the document elements before the body is even parsed.
  document.documentElement.style.display = 'none';

  if (window.self === window.top) {
      // Not in a frame, safely show the document.
      document.documentElement.style.display = '';
  } else {
      // In a frame! Attempt to bust out.
      try {
          // Attempt redirect directly.
          // Writing to window.top.location is allowed even cross-origin (navigation),
          // unless blocked by sandbox ('allow-top-navigation').
          // Reading window.top.location properties (like hostname) throws SecurityError if cross-origin.
          // So we skip reading and just try to write.
          window.top.location = window.self.location;
      } catch (e) {
          // If sandbox blocks navigation, we catch the error.
          // The content remains hidden, so the user is protected from clickjacking.
          console.warn('Sentinel: Failed to break frame. Site is likely running in a sandboxed iframe. Content remains hidden for protection.');
      }
  }
})();
