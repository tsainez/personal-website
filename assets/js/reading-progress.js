(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  // Optimized: Read layout properties only when necessary (resize/content change), not on every scroll
  function updateDimensions() {
    cachedDocHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached document height to avoid layout thrashing
    const scrollPercent = cachedDocHeight > 0 ? (scrollTop / cachedDocHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update cached dimensions on window resize
  window.addEventListener('resize', () => {
    updateDimensions();
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver to detect dynamic content changes that affect height
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
    // Observing body is usually enough to catch content growth
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  updateDimensions();
  updateProgress();
})();
