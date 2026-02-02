(function() {
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Select headers within the post content or page content
    const headers = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6, .page-content h2, .page-content h3, .page-content h4');

    function addAnchor(header) {
      if (!header.id || header.querySelector('.anchor-link')) return;

      // Create the anchor link button
      const anchor = document.createElement('button');
      anchor.className = 'anchor-link';
      anchor.innerHTML = '#';
      anchor.setAttribute('aria-label', 'Copy link to section');
      anchor.setAttribute('title', 'Copy link to section');

      // Append it to the header
      header.appendChild(anchor);
    }

    // Performance Optimization: Lazy load anchor links
    // Only create and append buttons when the header is close to the viewport.
    // This reduces initial DOM manipulation and layout calculation costs on long pages.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addAnchor(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px 0px' // Load slightly before they appear
      });

      headers.forEach(header => {
        if (header.id) observer.observe(header);
      });
    } else {
      // Fallback for older browsers
      headers.forEach(addAnchor);
    }
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
