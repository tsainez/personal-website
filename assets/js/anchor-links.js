(function() {
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Select headers within the post content or page content
    const headers = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6, .page-content h2, .page-content h3, .page-content h4');

    function addAnchorLink(header) {
      if (!header.id || header.querySelector('.anchor-link')) return;

      // Create the anchor link button
      const anchor = document.createElement('button');
      anchor.className = 'anchor-link';
      anchor.innerHTML = '#';

      const headerText = header.textContent.trim();
      const label = `Copy link to section: ${headerText}`;

      anchor.setAttribute('aria-label', label);
      anchor.setAttribute('title', label);
      anchor.setAttribute('data-original-label', label);

      // Append it to the header
      header.appendChild(anchor);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addAnchorLink(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px 0px'
      });

      headers.forEach(header => observer.observe(header));
    } else {
      headers.forEach(addAnchorLink);
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
        const originalLabel = anchor.getAttribute('data-original-label') || 'Copy link to section';
        anchor.setAttribute('aria-label', originalLabel);
        delete anchor._timeoutId;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy anchor:', err);
    }
  });
})();
