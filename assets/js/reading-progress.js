(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  function updateDimensions() {
    // These trigger reflow, so we do them only on resize/init
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    cachedDocHeight = scrollHeight - clientHeight;

    // Force an update since percentages might have changed
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

  // Use ResizeObserver to detect content changes (e.g. images loading)
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(document.documentElement);
    observer.observe(document.body);
  }

  // Always listen to window resize for viewport changes (clientHeight)
  // which ResizeObserver on body/documentElement might not capture
  window.addEventListener('resize', updateDimensions, { passive: true });

  // Initial update
  updateDimensions();
})();
