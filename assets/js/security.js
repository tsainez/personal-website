/**
 * 🛡️ Sentinel: Frame Busting Protection
 * Prevents the site from being loaded within an iframe to mitigate Clickjacking attacks.
 * This is necessary because GitHub Pages does not support X-Frame-Options or CSP frame-ancestors headers.
 */
(function() {
  if (window.self !== window.top) {
    // 🛡️ Sentinel: Immediate Protection
    // Hide the content immediately to prevent interaction if the site is framed.
    // This protects against attacks where frame busting is blocked (e.g., sandboxed iframe).
    document.documentElement.style.display = 'none';

    try {
      if (window.top.location.hostname !== window.self.location.hostname) {
        // Attempt to break out of the frame
        window.top.location = window.self.location;
      } else {
        // Allow same-origin framing (optional, but safer to default to busting)
        // For strict security, we still break out:
        window.top.location = window.self.location;
      }
    } catch (e) {
      // If SOP blocks access to window.top (e.g., cross-origin) or sandbox blocks navigation:
      // Keep the content hidden.
      console.warn('Sentinel: Anti-clickjacking protection activated. Content hidden.');

      // Double down on hiding
      // We can also remove the body content to be sure.
      document.addEventListener('DOMContentLoaded', function() {
        document.body.innerHTML = '<h1>Access Denied</h1><p>This content cannot be displayed in a frame.</p>';
        document.documentElement.style.display = 'block'; // Show the error message
      });
    }
  }
})();
