(function() {
  const triggerPhrase = 'do a barrel roll';
  let inputBuffer = '';

  document.addEventListener('keydown', (e) => {
    // Ignore keypresses if modifier keys are pressed or focus is in an input
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const key = e.key.toLowerCase();

    // Only capture single character keys and spaces
    if (key.length === 1) {
        inputBuffer += key;

        // Keep buffer size limited to the trigger phrase length to avoid memory leaks
        if (inputBuffer.length > triggerPhrase.length) {
            inputBuffer = inputBuffer.slice(-triggerPhrase.length);
        }

        if (inputBuffer === triggerPhrase) {
            doBarrelRoll();
            inputBuffer = ''; // Reset buffer after trigger
        }
    } else if (key === 'escape') {
        inputBuffer = ''; // Clear on escape
    }
  });

  function doBarrelRoll() {
    // Check if animation is already running to avoid restarting
    if (document.body.classList.contains('barrel-roll-active')) {
        return;
    }

    document.body.classList.add('barrel-roll-active');

    // Remove the class after the animation completes (e.g. 2s)
    setTimeout(() => {
        document.body.classList.remove('barrel-roll-active');
    }, 2000);
  }
})();
