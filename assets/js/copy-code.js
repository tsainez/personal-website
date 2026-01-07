(function() {
  // Target only the wrapper divs (or figures) to avoid selecting the inner 'pre.highlight'
  const selector = 'div.highlight, figure.highlight';

  // Helper to create and append the button
  const addCopyButton = (block) => {
    // Check if button already exists to prevent duplicates
    if (block.querySelector('.copy-code-button')) return;

    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = 'Copy';

    block.appendChild(button);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          addCopyButton(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px' // Load buttons slightly before they come into view
    });

    document.querySelectorAll(selector).forEach(block => observer.observe(block));
  } else {
    // Fallback for browsers without IntersectionObserver support
    document.querySelectorAll(selector).forEach(addCopyButton);
  }

  // Performance Optimization: Event Delegation
  // Instead of attaching a listener to every button (O(N)), we attach one global listener (O(1)).
  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.copy-code-button');
    if (!button) return;

    const block = button.closest(selector);
    if (!block) return;

    const code = block.querySelector('code');
    const text = code ? code.innerText : '';

    try {
      await navigator.clipboard.writeText(text);

      // Feedback
      button.innerText = 'Copied!';
      button.ariaLabel = 'Copied successfully';
      button.classList.add('copied');

      // Clear any existing timeout to prevent flickering if clicked rapidly
      if (button._timeoutId) clearTimeout(button._timeoutId);

      button._timeoutId = setTimeout(() => {
        button.innerText = 'Copy';
        button.ariaLabel = 'Copy code to clipboard';
        button.classList.remove('copied');
        delete button._timeoutId;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      button.innerText = 'Error';
    }
  });
})();
