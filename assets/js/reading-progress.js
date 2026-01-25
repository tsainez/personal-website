(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let docHeight = 0;

  function updateMetrics() {
    docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent division by zero if page is not scrollable
    // Use cached docHeight
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  // Initial update
  updateMetrics();
  updateProgress();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update on resize
  window.addEventListener('resize', () => {
    updateMetrics();
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver for more robust updates if available
  if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
          updateMetrics();
          if (!ticking) {
             window.requestAnimationFrame(updateProgress);
             ticking = true;
          }
      });
      observer.observe(document.documentElement);
  }
})();
