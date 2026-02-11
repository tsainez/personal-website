(function() {
  // Performance Optimization: Anchor links are now generated at build time (by _plugins/anchor_links.rb).
  // This script only handles the copy-to-clipboard functionality.

  // Event Delegation for click on .anchor-link
  document.addEventListener('click', async (e) => {
    const anchor = e.target.closest('.anchor-link');
    if (!anchor) return;

    // Use the href property (returns full URL)
    const href = anchor.href;
    if (!href) return;

    // Prevent default navigation to avoid jumping if the user just wants to copy
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(href);

      // Feedback
      anchor.classList.add('copied');
      anchor.setAttribute('aria-label', 'Link copied');

      // Reset after 2 seconds
      if (anchor._timeoutId) clearTimeout(anchor._timeoutId);

      anchor._timeoutId = setTimeout(() => {
        anchor.classList.remove('copied');
        anchor.setAttribute('aria-label', 'Link to section');
        delete anchor._timeoutId;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy anchor:', err);
    }
  });
})();
