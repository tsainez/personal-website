(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  // Cache document dimensions to avoid layout thrashing on scroll
  function updateDimensions() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    cachedDocHeight = scrollHeight - clientHeight;

    // Force an update to the progress bar with new dimensions
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

  // Update dimensions on resize
  window.addEventListener('resize', updateDimensions, { passive: true });

  // Update dimensions when content size changes (e.g. images loading)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  updateDimensions();
})();
