(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;
  let cachedClientHeight = 0;

  function updateMetrics() {
    cachedDocHeight = document.documentElement.scrollHeight;
    cachedClientHeight = document.documentElement.clientHeight;

    // Force an update to reflect new metrics
    if (!ticking) {
       window.requestAnimationFrame(updateProgress);
       ticking = true;
    }
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached values to avoid layout thrashing
    const docHeight = cachedDocHeight - cachedClientHeight;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  // Initialize metrics
  updateMetrics();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver for efficient updates
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
        updateMetrics();
    });
    // Observe body for height changes (dynamic content)
    resizeObserver.observe(document.body);
    // Observe documentElement for viewport/layout changes
    resizeObserver.observe(document.documentElement);
  }

  // Fallback and for window resize events
  window.addEventListener('resize', () => {
     updateMetrics();
  }, { passive: true });
})();
