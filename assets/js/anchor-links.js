(function() {
  const init = () => {
    // Select headers within the post content or page content
    const headers = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6, .page-content h2, .page-content h3, .page-content h4');

    const addAnchor = (header) => {
      if (!header.id) return;
      // Ensure we don't add duplicate buttons
      if (header.querySelector('.anchor-link')) return;

      // Create the anchor link button
      const anchor = document.createElement('button');
      anchor.className = 'anchor-link';
      anchor.innerHTML = '#';
      anchor.setAttribute('aria-label', 'Copy link to section');
      anchor.setAttribute('title', 'Copy link to section');

      // Append it to the header
      header.appendChild(anchor);
    };

    // Performance Optimization: Use IntersectionObserver to lazy-load anchor links
    // This reduces initial DOM nodes and layout cost on long pages.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addAnchor(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        // Load anchors slightly before they scroll into view
        rootMargin: '200px'
      });

      headers.forEach(header => observer.observe(header));
    } else {
      // Fallback for older browsers
      headers.forEach(addAnchor);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

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
