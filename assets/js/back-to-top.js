(function() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  // Bolt Optimization: Use IntersectionObserver to toggle visibility instead of scroll event listener.
  // This reduces main thread work by offloading scroll tracking to the browser.
  if ('IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '100%';
    sentinel.style.height = '300px'; // Button appears after scrolling past this height
    sentinel.style.pointerEvents = 'none';
    sentinel.style.visibility = 'hidden'; // Ensure it doesn't interfere visually

    document.body.prepend(sentinel);

    const observer = new IntersectionObserver((entries) => {
      // If the sentinel is NOT intersecting, it means we've scrolled past the top 300px.
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
    });

    observer.observe(sentinel);
  } else {
    // Fallback for older browsers
    const toggleButtonVisibility = () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          toggleButtonVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  backToTopButton.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    // Move focus back to the top of the document for accessibility
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();

    // Clean up tabindex on blur
    document.body.addEventListener('blur', () => {
      document.body.removeAttribute('tabindex');
    }, { once: true });
  });
})();
