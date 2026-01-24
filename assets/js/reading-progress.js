(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  // Performance: Calculate layout metrics only when layout changes
  function updateMetrics() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    cachedDocHeight = scrollHeight - clientHeight;

    // Trigger an update since metrics changed
    requestUpdate();
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = cachedDocHeight > 0 ? (scrollTop / cachedDocHeight) * 100 : 0;

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

  // Update on resize as document height might change
  window.addEventListener('resize', updateMetrics, { passive: true });

  // Performance: Use ResizeObserver to detect content changes (lazy loading, dynamic content)
  // This allows us to cache the document height and avoid reading it on every scroll event
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      updateMetrics();
    });
    // Observing body is usually sufficient to catch content height changes
    observer.observe(document.body);
  }

  // Initial update
  updateMetrics();
})();
