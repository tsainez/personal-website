(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.post-content a, .page-content a');

    links.forEach(link => {
      // Check if external and http/https
      if (link.hostname &&
          link.hostname !== window.location.hostname &&
          (link.protocol === 'http:' || link.protocol === 'https:')) {

        // Add attributes
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.add('external-link');

        // Create icon (using a temporary container to parse HTML string)
        const temp = document.createElement('span');
        temp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="external-link-icon" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
        const svg = temp.firstElementChild;

        // Create screen reader text
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = ' (opens in a new tab)';

        // Append to link
        link.appendChild(svg);
        link.appendChild(srText);
      }
    });
  });
})();
