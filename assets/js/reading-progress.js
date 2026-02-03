(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  // Performance optimization: Cache the document height to avoid layout thrashing on scroll
  let maxScroll = 0;

  function updateMaxScroll() {
    maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    // We still need to read scrollTop, but we avoid reading scrollHeight/clientHeight which forces full layout calc
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

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

  // Update maxScroll on resize
  window.addEventListener('resize', () => {
    updateMaxScroll();
    // Also update progress in case resize changed the percentage
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver to detect content changes (e.g. images loading, dynamic content)
  // This is more performant than polling and more accurate than just window resize
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateMaxScroll();
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
    // Observe body to detect height changes
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  updateMaxScroll();
  updateProgress();
})();
