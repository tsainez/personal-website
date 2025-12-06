console.log('Konami script loaded');

document.addEventListener('DOMContentLoaded', () => {
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiCodePosition = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    const requiredKey = konamiCode[konamiCodePosition];

    if (key === requiredKey) {
      konamiCodePosition++;
      if (konamiCodePosition === konamiCode.length) {
        activateEasterEgg();
        konamiCodePosition = 0;
      }
    } else {
      konamiCodePosition = 0;
    }
  });

  function activateEasterEgg() {
    console.log("🌟 You found the secret! 🌟");

    // Invert the HTML element to catch the background too
    document.documentElement.style.filter = "invert(1)";
    document.documentElement.style.transition = "filter 0.5s ease";

    // Create a floating element
    const egg = document.createElement('div');
    egg.innerText = "SURPRISE!";
    egg.id = "easter-egg-rabbit";
    egg.style.position = "fixed";
    egg.style.left = "50%";
    egg.style.top = "50%";
    egg.style.fontSize = "100px";
    egg.style.fontWeight = "bold";
    egg.style.fontFamily = "sans-serif";
    egg.style.color = "red"; // This will be inverted to cyan
    egg.style.transform = "translate(-50%, -50%)";
    egg.style.zIndex = "9999";
    egg.style.pointerEvents = "none";
    egg.style.animation = "spin 2s linear infinite";
    document.body.appendChild(egg);

    // Add CSS for spin
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
});
