(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  // Performance Optimization: Cache document dimensions
  // Reading scrollHeight/clientHeight causes reflow. We only want to do this when necessary
  // (on resize or content change), not on every scroll event.
  function updateMetrics() {
    cachedDocHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached value to avoid layout thrashing
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

  function onResize() {
    updateMetrics();
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  // Update on window resize (e.g. orientation change)
  window.addEventListener('resize', onResize, { passive: true });

  // Update on content size change (e.g. images loading, dynamic content)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(document.body);
  }

  // Initial update
  updateMetrics();
  updateProgress();
})();
