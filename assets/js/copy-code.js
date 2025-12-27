document.addEventListener('DOMContentLoaded', () => {
  // Target only the wrapper divs (or figures) to avoid selecting the inner 'pre.highlight'
  const codeBlocks = document.querySelectorAll('div.highlight, figure.highlight');

  codeBlocks.forEach((block) => {
    // Check if button already exists to prevent duplicates
    if (block.querySelector('.copy-code-button')) return;

    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = 'Copy';

    block.appendChild(button);

    button.addEventListener('click', async () => {
      // Find the code element inside the block
      const code = block.querySelector('code');
      const text = code ? code.innerText : '';

      try {
        await navigator.clipboard.writeText(text);

        // Feedback
        button.innerText = 'Copied!';
        button.classList.add('copied');

        setTimeout(() => {
          button.innerText = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.innerText = 'Error';
      }
    });
  });
});
