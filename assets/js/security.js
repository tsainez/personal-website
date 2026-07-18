/**
 * 🛡️ Sentinel: Frame Busting Protection
 * Prevents the site from being loaded within an iframe to mitigate Clickjacking attacks.
 * This is necessary because GitHub Pages does not support X-Frame-Options or CSP frame-ancestors headers.
 *
 * IMPROVED DEFENSE:
 * 1. Unconditionally hides the entire document by setting display: none on the root element.
 * 2. Checks if the window is top-level.
 * 3. If top-level, restores the document display.
 * 4. If framed, attempts to bust out (redirect top window).
 */
(function() {
  // 1. Hide everything immediately.
  // This prevents the user from seeing or interacting with the framed site.
  // We use JavaScript to set the style to avoid inline <style> tags which might be blocked by CSP.
  // By hiding the document element immediately, we ensure the body won't be rendered when parsed.
  document.documentElement.style.display = 'none';

  if (window.self === window.top) {
      // 2. We are not in a frame. Restore visibility.
      // Modern display is block for HTML.
      document.documentElement.style.display = 'block';
  } else {
      // 3. We are in a frame.
      try {
          // Attempt redirect directly.
          // Writing to window.top.location is allowed even cross-origin (navigation),
          // unless blocked by sandbox ('allow-top-navigation').
          // Reading window.top.location properties (like hostname) throws SecurityError if cross-origin.
          window.top.location = window.self.location;
      } catch (e) {
          // If sandbox blocks navigation, we catch the error.
          // The content remains hidden (display: none), so the user is protected.
          console.warn('Sentinel: Failed to break frame. Site is likely running in a sandboxed iframe. Content remains hidden for protection.');
      }
  }
})();
