(function() {
  const progressBar = document.getElementById('reading-progress');

  if (!progressBar) return;

  let ticking = false;
  let cachedDocHeight = 0;
  let isMobile = false;
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  function checkMobile() {
    isMobile = mobileQuery.matches;
    if (isMobile) {
      progressBar.style.width = '0%';
      // Optional: hide it completely
      // progressBar.style.display = 'none';
    } else {
      // progressBar.style.display = 'block';
      updateDimensions();
    }
  }

  function updateDimensions() {
    if (isMobile) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    cachedDocHeight = scrollHeight - clientHeight;

    requestUpdate();
  }

  function updateProgress() {
    if (isMobile) {
        ticking = false;
        return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = cachedDocHeight > 0 ? (scrollTop / cachedDocHeight) * 100 : 0;

    progressBar.style.width = scrollPercent + '%';
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking && !isMobile) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  // Event Listeners
  window.addEventListener('scroll', requestUpdate, { passive: true });

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(document.documentElement);
    observer.observe(document.body);
  }

  window.addEventListener('resize', updateDimensions, { passive: true });

  // Mobile listener
  if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', checkMobile);
  } else {
      // Fallback for older browsers
      mobileQuery.addListener(checkMobile);
  }

  // Initial Check
  checkMobile();
  // If not mobile, it calls updateDimensions -> requestUpdate -> updateProgress
})();
