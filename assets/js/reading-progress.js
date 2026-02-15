(function() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;

  function calculateDocHeight() {
    // Reading these properties forces a reflow, so we only do it when necessary (resize/init)
    cachedDocHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Performance Optimization: Use cached docHeight to avoid layout thrashing (reading scrollHeight/clientHeight)
    // during the critical scroll path.
    const scrollPercent = cachedDocHeight > 0 ? (scrollTop / cachedDocHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  // Recalculate dimensions when layout changes
  function onResize() {
    calculateDocHeight();
    // We update progress here too just in case the resize changed the percentage
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  // Use ResizeObserver to detect dynamic content changes that affect height
  // This covers cases where content is added/removed without a window resize
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    // Observing body is usually sufficient for page height changes
    resizeObserver.observe(document.body);
  }

  // Initial calculation
  calculateDocHeight();
  updateProgress();
})();
