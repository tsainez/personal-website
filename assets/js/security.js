/**
 * 🛡️ Sentinel: Frame Busting Protection
 * Prevents the site from being loaded within an iframe to mitigate Clickjacking attacks.
 * This is necessary because GitHub Pages does not support X-Frame-Options or CSP frame-ancestors headers.
 */
(function() {
  if (window.self !== window.top) {
    try {
      // Attempt to break out of the frame
      window.top.location = window.self.location;
    } catch (e) {
      // If SOP blocks access to window.top (e.g., cross-origin), we can't break out easily.
      // But we can log a warning or take other actions if needed.
      console.warn('Sentinel: Failed to break frame. Site is likely running in a sandboxed iframe.');
    }
  }
})();
