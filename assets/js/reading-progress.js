(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  // Cache document dimensions to avoid layout thrashing during scroll
  function updateDocHeight() {
    cachedDocHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Force an update after recalculating height
    requestUpdate();
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached docHeight
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

  // Update dimensions on resize
  window.addEventListener('resize', updateDocHeight, { passive: true });

  // Use ResizeObserver to detect content changes (e.g., lazy loaded images)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDocHeight();
    });
    // Observing body to catch height changes
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  updateDocHeight();
})();
