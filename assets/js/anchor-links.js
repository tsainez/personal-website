(function() {
  const content = document.querySelector('.post-content, .page-content');
  if (!content) return;

  const headers = content.querySelectorAll('h2, h3, h4, h5, h6');

  headers.forEach(header => {
    if (!header.id) return;

    const anchor = document.createElement('a');
    anchor.className = 'anchor-link';
    anchor.href = '#' + header.id;
    anchor.setAttribute('aria-label', 'Link to section: ' + header.innerText);
    anchor.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    `;

    // Click handler to copy link instead of just navigating
    anchor.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = window.location.origin + window.location.pathname + '#' + header.id;

      try {
        await navigator.clipboard.writeText(url);

        // Update URL hash without scrolling
        history.pushState(null, null, '#' + header.id);

        // Feedback
        const originalLabel = anchor.getAttribute('aria-label');
        anchor.classList.add('copied');
        anchor.setAttribute('aria-label', 'Link copied successfully');

        setTimeout(() => {
          anchor.classList.remove('copied');
          anchor.setAttribute('aria-label', originalLabel);
        }, 2000);

      } catch (err) {
        console.error('Failed to copy link:', err);
        // Fallback: just let the link default behavior happen (navigate)
        window.location.hash = header.id;
      }
    });

    header.appendChild(anchor);
  });
})();
