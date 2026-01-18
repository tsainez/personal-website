(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let docHeight = 0;

  // Performance Optimization: Cache docHeight to avoid forced synchronous layout in scroll handler
  function updateMetrics() {
    docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Force an update when metrics change
    requestUpdate();
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });

  // Update metrics on resize
  window.addEventListener('resize', () => {
    updateMetrics();
  }, { passive: true });

  // Use ResizeObserver to detect content changes (e.g. lazy loaded images)
  // This is more performant than checking scrollHeight on every frame
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });
    // Observe body for height changes
    resizeObserver.observe(document.body);
  }

  // Initial update
  updateMetrics();
})();
