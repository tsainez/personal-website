(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let docHeight = 0;

  function updateDocHeight() {
    docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Force an update to the progress bar in case height change affects percentage
    requestTick();
  }

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });

  // Update on resize as document height might change
  window.addEventListener('resize', updateDocHeight, { passive: true });

  // Performance Optimization: Cache docHeight and update via ResizeObserver
  // Use ResizeObserver if available to detect content changes (e.g. images loading)
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateDocHeight();
    });
    // Observing document.body is often more reliable for content height changes than documentElement
    if (document.body) {
      resizeObserver.observe(document.body);
    } else {
      resizeObserver.observe(document.documentElement);
    }
  }

  // Initial update
  updateDocHeight();
})();
