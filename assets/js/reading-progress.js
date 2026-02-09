(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedScrollableHeight = 0;

  // Function to update cached dimensions.
  // This reads layout properties (scrollHeight/clientHeight), causing a reflow.
  // We only call this when necessary (resize, content change), not on every scroll.
  function updateDimensions() {
    const docEl = document.documentElement;
    cachedScrollableHeight = docEl.scrollHeight - docEl.clientHeight;
  }

  function updateProgress() {
    // scrollTop via window.scrollY is generally fast and doesn't trigger layout if no other layout props are read.
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Use cached value to avoid reading layout properties here
    const scrollPercent = cachedScrollableHeight > 0 ? (scrollTop / cachedScrollableHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  // Initial calculation
  updateDimensions();
  updateProgress();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update on resize as document height or viewport height might change
  window.addEventListener('resize', () => {
    updateDimensions();
    // Also update progress in case resize changed the percentage
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Use ResizeObserver to detect content changes that don't trigger window resize
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
    // Observing body allows detecting if content pushes the height
    resizeObserver.observe(document.body);
  }
})();
