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

    // 1. Change Background
    document.body.style.transition = "background-color 2s ease";
    document.body.style.backgroundColor = "#050510"; // Deep space
    document.body.style.color = "#ffffff"; // Make text white

    // Fix links to be visible in space
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = "#66ccff";
        link.style.transition = "color 1s";
    });

    // 2. Add Stars (Optimized with DocumentFragment)
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
        createStar(fragment);
    }
    document.body.appendChild(fragment);

    // 3. Float Elements (Optimized with CSS Variables)
    // Create shared keyframes once
    if (!document.getElementById('zero-gravity-styles')) {
        const style = document.createElement('style');
        style.id = 'zero-gravity-styles';
        style.innerHTML = `
          @keyframes float-variable {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
    }

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

  function createStar(container) {
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
    star.style.animation = `twinkle ${duration}s infinite alternate`;

    container.appendChild(star);
  }

  function applyFloatAnimation(el) {
    el.style.transition = "transform 5s ease-in-out";
    el.style.display = "inline-block"; // Needed for transform to work on some inline elements

    // Randomize the float pattern using CSS variables
    const xMove = (Math.random() - 0.5) * 50; // -25 to 25px
    const yMove = (Math.random() - 0.5) * 50;
    const rot = (Math.random() - 0.5) * 20; // -10 to 10 deg

    el.style.setProperty('--tx', `${xMove}px`);
    el.style.setProperty('--ty', `${yMove}px`);
    el.style.setProperty('--rot', `${rot}deg`);

    // Random delay and duration
    const duration = Math.random() * 5 + 3; // 3-8s
    el.style.animation = `float-variable ${duration}s ease-in-out infinite`;
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

    // Animate rocket
    setTimeout(() => {
        rocket.style.left = "120%";
        rocket.style.top = "20%";
    }, 100);
  }
});
