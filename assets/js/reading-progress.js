(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedMaxScroll = 0;

  // Cache layout metrics to avoid thrashing in the scroll loop
  function updateMetrics() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    cachedMaxScroll = scrollHeight - clientHeight;

    // Update progress immediately when metrics change
    requestUpdate();
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = cachedMaxScroll > 0 ? (scrollTop / cachedMaxScroll) * 100 : 0;

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
  window.addEventListener('resize', updateMetrics, { passive: true });

  // Update metrics when content changes size (ResizeObserver)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });
    // Observing body handles most content changes
    resizeObserver.observe(document.body);
  }

  // Initial update
  updateMetrics();
})();
