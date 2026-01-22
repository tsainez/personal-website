(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  // Cache layout properties to avoid thrashing
  let docHeight = 0;
  let clientHeight = 0;

  function updateMetrics() {
    docHeight = document.documentElement.scrollHeight;
    clientHeight = document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollableDistance = docHeight - clientHeight;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = scrollableDistance > 0 ? (scrollTop / scrollableDistance) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  // Initial metrics calculation
  updateMetrics();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateMetrics(); // Recalculate metrics on resize
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Observe content changes (e.g., lazy loaded images)
  // Optimization: Use ResizeObserver to avoid polling or manual updates
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
      updateProgress();
    });
    resizeObserver.observe(document.documentElement);
  }

  // Initial update
  updateProgress();
})();
