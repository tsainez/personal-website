(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let maxScroll;

  function updateMaxScroll() {
    // Calculate max scrollable distance
    // We cache this to avoid layout thrashing during scroll events
    maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached maxScroll. Check for > 0 to avoid division by zero.
    const scrollPercent = (maxScroll && maxScroll > 0) ? (scrollTop / maxScroll) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateMaxScroll();
  updateProgress();

  // Performance Optimization: Use ResizeObserver to update maxScroll only when dimensions change.
  // This replaces reading layout properties on every scroll frame.
  const onResize = () => {
    updateMaxScroll();
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
  } else {
    // Fallback for older browsers
    window.addEventListener('resize', onResize, { passive: true });
  }
})();
