(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let docHeight = 0;

  // Performance optimization: Cache document dimensions to avoid layout thrashing during scroll
  function updateDimensions() {
    // These reads force a reflow, but we only do this on resize/content change, not every scroll event.
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    docHeight = scrollHeight - clientHeight;
  }

  function updateProgress() {
    // Only read scrollTop (which is fast/cached by browsers)
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached docHeight
    // Prevent division by zero if page is not scrollable
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  // Initial calculation
  updateDimensions();
  // Perform an initial update in case we start scrolled down
  updateProgress();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update on window resize (handles viewport changes)
  window.addEventListener('resize', () => {
    updateDimensions();
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver to detect content changes (e.g. dynamic content loading)
  // This is more efficient than polling or assuming content is static
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
    // Observing body handles most content changes
    resizeObserver.observe(document.body);
  }
})();
