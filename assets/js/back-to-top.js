(function() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

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

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Move focus back to the top of the document for accessibility
    document.body.focus();
  });
})();
