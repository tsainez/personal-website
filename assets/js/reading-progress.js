(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Prevent division by zero if page is not scrollable
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Update on resize as document height might change
  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Initial update
  updateProgress();
})();
