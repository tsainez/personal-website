(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let maxScroll = 0;

  // Cache document dimensions to avoid layout thrashing during scroll
  function updateDimensions() {
    const docHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    maxScroll = docHeight - clientHeight;

    // Ensure progress is updated with new dimensions
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached maxScroll
    // Prevent division by zero if page is not scrollable
    const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update dimensions on resize
  window.addEventListener('resize', updateDimensions, { passive: true });

  // Update dimensions when content changes size (e.g. lazy loaded images)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    // Observing body is usually sufficient to catch content changes
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  updateDimensions();
})();
