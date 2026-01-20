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
      anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
      anchor.setAttribute('aria-label', 'Copy link to section');
      anchor.setAttribute('title', 'Copy link to section');

      // Append it to the header
      header.appendChild(anchor);
    });
  });

  // Performance Optimization: Event Delegation
  // Instead of attaching a listener to every button (O(N)), we attach one global listener (O(1)).
  document.addEventListener('click', async (e) => {
    const anchor = e.target.closest('.anchor-link');
    if (!anchor) return;

    // Optional: Validate it's one of our anchors (though class check is usually enough)
    const header = anchor.parentElement;
    if (!header || !header.id) return;

    e.preventDefault();
    const url = window.location.origin + window.location.pathname + '#' + header.id;

    try {
      await navigator.clipboard.writeText(url);

      // Feedback
      anchor.classList.add('copied');
      anchor.setAttribute('aria-label', 'Link copied');

      // Reset after 2 seconds
      // Use a property on the element to track the timeout to prevent overlap
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
})();
