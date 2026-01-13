(function() {
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Select headers within the post content or page content
    const headers = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6, .page-content h2, .page-content h3, .page-content h4');

    headers.forEach(header => {
      if (!header.id) return;

      // Create the anchor link button
      const anchor = document.createElement('button');
      anchor.className = 'anchor-link';
      anchor.innerHTML = '#';
      anchor.setAttribute('aria-label', 'Copy link to section');
      anchor.setAttribute('title', 'Copy link to section');

      // Append it to the header
      header.appendChild(anchor);
    });

    // Performance Optimization: Event Delegation
    // Use a single listener for all anchor links instead of one per header.
    document.addEventListener('click', async (e) => {
      const anchor = e.target.closest('.anchor-link');
      if (!anchor) return;

      e.preventDefault();

      const header = anchor.parentElement;
      // Ensure we have a valid header with an ID
      if (!header || !header.id) return;

      const url = window.location.origin + window.location.pathname + '#' + header.id;

      try {
        await navigator.clipboard.writeText(url);

        // Feedback
        anchor.classList.add('copied');
        anchor.setAttribute('aria-label', 'Link copied');

        // Clear any existing timeout to prevent state conflicts
        if (anchor._timeoutId) clearTimeout(anchor._timeoutId);

        // Reset after 2 seconds
        anchor._timeoutId = setTimeout(() => {
          anchor.classList.remove('copied');
          anchor.setAttribute('aria-label', 'Copy link to section');
          delete anchor._timeoutId;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy anchor:', err);
      }
    });
  });
})();
