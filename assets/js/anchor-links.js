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
    // Instead of attaching a listener to every button (O(N)), we attach one global listener (O(1)).
    document.addEventListener('click', async (e) => {
      const anchor = e.target.closest('.anchor-link');
      if (!anchor) return;

      // Ensure it's one of our anchor links (sanity check, though class name should suffice)
      // We can also check if it's inside a header if needed, but the class is specific enough.

      e.preventDefault();

      const header = anchor.parentElement;
      if (!header || !header.id) return;

      const url = window.location.origin + window.location.pathname + '#' + header.id;

      try {
        await navigator.clipboard.writeText(url);

        // Feedback
        anchor.classList.add('copied');
        anchor.setAttribute('aria-label', 'Link copied');

        // Reset after 2 seconds
        // Clear any existing timeout to prevent flickering if clicked rapidly
        if (anchor._timeoutId) clearTimeout(anchor._timeoutId);

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
