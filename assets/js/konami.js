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
        activateZeroGravity();
        konamiCodePosition = 0;
      }
    } else {
      konamiCodePosition = 0;
    }
  });

  function activateZeroGravity() {
    console.log("🚀 Initiating Zero Gravity Mode...");

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      console.log("Reduced motion detected. Skipping motion effects.");
    }

    // 1. Change Background (Safe for reduced motion)
    document.body.style.transition = reducedMotion ? "none" : "background-color 2s ease";
    document.body.style.backgroundColor = "#050510"; // Deep space
    document.body.style.color = "#ffffff"; // Make text white

    // Fix links to be visible in space
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = "#66ccff";
        link.style.transition = reducedMotion ? "none" : "color 1s";
    });

    // 2. Add Stars (Static if reduced motion)
    for (let i = 0; i < 100; i++) {
        createStar(reducedMotion);
    }

    // Skip motion-heavy effects if reduced motion is preferred
    if (reducedMotion) {
      return;
    }

    // 3. Float Elements
    const elements = document.querySelectorAll('p, h1, h2, h3, li, span, .site-title, .page-link');
    elements.forEach(el => {
        // Only float visible elements that are not part of our effects
        if (el.offsetParent !== null && !el.classList.contains('star') && el.id !== 'rocket') {
            applyFloatAnimation(el);
        }
    });

    // 4. Launch Rocket
    createRocket();
  }

  function createStar(reducedMotion) {
    const star = document.createElement('div');
    star.classList.add('star');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 3;
    const duration = Math.random() * 3 + 1;

    star.style.position = 'fixed';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = 'white';
    star.style.borderRadius = '50%';
    star.style.zIndex = '-1';

    if (!reducedMotion) {
      star.style.animation = `twinkle ${duration}s infinite alternate`;
    }

    document.body.appendChild(star);
  }

  function applyFloatAnimation(el) {
    el.style.transition = "transform 5s ease-in-out";
    el.style.display = "inline-block"; // Needed for transform to work on some inline elements

    // Randomize the float pattern
    const floatId = `float-${Math.random().toString(36).substr(2, 9)}`;
    const xMove = (Math.random() - 0.5) * 50; // -25 to 25px
    const yMove = (Math.random() - 0.5) * 50;
    const rot = (Math.random() - 0.5) * 20; // -10 to 10 deg

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ${floatId} {
        0% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(${xMove}px, ${yMove}px) rotate(${rot}deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);

    // Random delay and duration
    const duration = Math.random() * 5 + 3; // 3-8s
    el.style.animation = `${floatId} ${duration}s ease-in-out infinite`;
  }

  function createRocket() {
    const rocket = document.createElement('div');
    rocket.innerText = "🚀";
    rocket.id = "rocket";
    rocket.style.position = "fixed";
    rocket.style.fontSize = "50px";
    rocket.style.zIndex = "10000";
    rocket.style.left = "-100px";
    rocket.style.top = "50%";
    rocket.style.transition = "left 10s linear, top 10s ease-in-out";

    document.body.appendChild(rocket);

    // Add stars twinkling animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes twinkle {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Animate rocket
    setTimeout(() => {
        rocket.style.left = "120%";
        rocket.style.top = "20%";
    }, 100);
  }
});
