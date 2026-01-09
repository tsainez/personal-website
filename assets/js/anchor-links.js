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

      // Add click event
      anchor.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = window.location.origin + window.location.pathname + '#' + header.id;

        try {
          await navigator.clipboard.writeText(url);

          // Feedback
          const originalText = anchor.innerHTML;
          anchor.classList.add('copied');
          anchor.setAttribute('aria-label', 'Link copied');

          // Reset after 2 seconds
          setTimeout(() => {
            anchor.classList.remove('copied');
            anchor.setAttribute('aria-label', 'Copy link to section');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy anchor:', err);
        }
      });
    });
  });
})();
