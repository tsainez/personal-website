(function() {
  const navTrigger = document.getElementById('nav-trigger');
  const navLabel = document.querySelector('label[for="nav-trigger"]');

  if (!navTrigger || !navLabel) return;

  function toggleNav() {
    navTrigger.checked = !navTrigger.checked;
    updateAriaState();
  }

  function updateAriaState() {
    const isExpanded = navTrigger.checked;
    navLabel.setAttribute('aria-expanded', isExpanded);
    navLabel.setAttribute('aria-label', isExpanded ? 'Close navigation' : 'Toggle navigation');
  }

  // Initial state check (in case browser preserved checked state on reload)
  updateAriaState();

  // Listen for clicks on the label (mouse interaction)
  // Note: Clicking a label automatically toggles the associated checkbox input,
  // so we only need to update the ARIA state.
  navLabel.addEventListener('click', () => {
    // We use a small timeout to let the checkbox state update first
    setTimeout(updateAriaState, 0);
  });

  // Listen for keyboard events on the label
  navLabel.addEventListener('keydown', (e) => {
    // Enter (13) or Space (32)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent scrolling for Space
      toggleNav();
    }
  });

  // Also listen for changes on the checkbox directly (e.g. via other scripts)
  navTrigger.addEventListener('change', updateAriaState);
})();
