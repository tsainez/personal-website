(function() {
  const progressBar = document.getElementById('reading-progress-bar');
  // Exit if the progress bar element doesn't exist on this page
  if (!progressBar) return;

  function updateProgress() {
    // Calculate how far down the page we've scrolled
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    // Calculate the total scrollable height
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Avoid division by zero if content fits on screen
    if (height <= 0) {
      progressBar.style.width = '0%';
      return;
    }

    const scrolled = (scrollTop / height) * 100;
    progressBar.style.width = scrolled + '%';
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation in case the page is reloaded with scroll position
  updateProgress();
})();
