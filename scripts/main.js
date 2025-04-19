document.addEventListener('DOMContentLoaded', () => {
  /********************************
   * 1) EXISTING DECORATION DOWNLOAD LOGIC
   ********************************/
  const decorationCells = document.querySelectorAll('.decoration-cell');
  
  decorationCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const imagePath = cell.getAttribute('data-image');
      const link = document.createElement('a');
      link.href = imagePath;
      link.download = imagePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  /********************************
   * 2) CONFETTI: HELPER FUNCTION
   ********************************/
  function spawnConfettiPiece(container) {
    const confetti = document.createElement('img');
  
    // Array of available confetti images
    const confettiImages = [
      'styles/egg1_confetti.png',
      'styles/egg2_confetti.png',
      'styles/egg3_confetti.png',
      'styles/egg4_confetti.png'
    ];
  
    // Pick a random one
    const randomImage = confettiImages[Math.floor(Math.random() * confettiImages.length)];
    confetti.src = randomImage;
  
    confetti.classList.add('confetti-piece');
  
    // Random pick: either "CW" or "CCW" animation
    const animationName = Math.random() < 0.5 ? 'confettiDriftCW' : 'confettiDriftCCW';
    confetti.style.animationName = animationName;
  
    // Random size: e.g. 30–50px
    const size = Math.floor(Math.random() * 20) + 30;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
  
    // Random horizontal start (0–100%)
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-50px';
  
    // Minimal random delay (0–0.5s)
    const smallDelay = Math.random() * 0.5;
    confetti.style.animationDelay = `${smallDelay}s`;
  
    // Random duration => e.g. 10–20s for a slow drift
    const duration = 10 + Math.random() * 10;
    confetti.style.animationDuration = `${duration}s`;
  
    // Remove from DOM after animation completes
    confetti.addEventListener('animationend', () => {
      container.removeChild(confetti);
    });
  
    container.appendChild(confetti);
  }

  /********************************
   * 3) CONFETTI: CONTINUOUS SPAWN
   ********************************/
  const container = document.querySelector('.confetti-container');
  if (!container) return;

  // Optionally spawn a few pieces immediately on load
  for (let i = 0; i < 5; i++) {
    spawnConfettiPiece(container);
  }

  // Then spawn a new piece every 1 second
  setInterval(() => {
    spawnConfettiPiece(container);
  }, 1000);

  /********************************
   * 3) SPARKLY MOUSE TRAIL
   ********************************/
  // Creates a cluster of stars on every mousemove
  window.addEventListener('mousemove', function(e) {
    // Adjust how many stars + distribution
    const arr = [1, 0.9, 0.8, 0.5, 0.2];

    arr.forEach(function(i) {
      const x = (1 - i) * 75;
      const star = document.createElement('div');
      star.className = 'star';

      // Random offset around the cursor
      star.style.top = e.clientY + Math.round(Math.random() * x - x / 2) + 'px';
      star.style.left = e.clientX + Math.round(Math.random() * x - x / 2) + 'px';

      document.body.appendChild(star);

      // Remove star after random time, so they don't accumulate
      window.setTimeout(function() {
        document.body.removeChild(star);
      }, Math.round(Math.random() * i * 600));
    });
  }, false);

    /********************************
  * 4) ARTIST LINK VISITED STATE
  ********************************/
  const artistLinks = document.querySelectorAll('.artist-info a');

  artistLinks.forEach(link => {
    const linkKey = `visited-${link.href}`;

    // On load: check if this link was visited before
    if (localStorage.getItem(linkKey)) {
      link.classList.add('visited-artist-link');
    }

    // On click: mark it as visited in localStorage
    link.addEventListener('click', () => {
      localStorage.setItem(linkKey, 'true');
    });
  });

/********************************
 * EASTER EGG: 10 QUICK CLICKS ON #jellyHomeImg
 ********************************/
(function() {
  const jellyHomeImg = document.getElementById('jellyHomeImg');
  const easterEggModal = document.getElementById('easterEggModal');
  if (!jellyHomeImg || !easterEggModal) return;

  let clickCount = 0;
  let lastClickTime = 0;
  const maxGap = 2000; // 2 seconds

  jellyHomeImg.addEventListener('click', () => {
    const now = Date.now();
    // If more than 2s since last click, reset count
    if (now - lastClickTime > maxGap) {
      clickCount = 0;
    }
    // Update lastClickTime + increment
    lastClickTime = now;
    clickCount++;

    // If we've reached 10 within 2s between each click, show Easter egg
    if (clickCount >= 10) {
      showEasterEgg();
      clickCount = 0;
    }
  });

  // We'll store the animationFrame ID so we can stop it when closed (optional)
  let rotateAnimationId = null;

  function showEasterEgg() {
    easterEggModal.classList.add('show');
    
    // Start rotating the gradient on the .modal-content element
    const modalContent = easterEggModal.querySelector('.modal-content');
    let angle = 0;

    function rotateGradient() {
      // Increment angle for a clockwise spin
      angle = (angle + 0.5) % 360;

      // Update the --angle property in real-time
      modalContent.style.setProperty('--angle', angle + 'deg');

      // Schedule the next frame
      rotateAnimationId = requestAnimationFrame(rotateGradient);
    }

    rotateGradient();

    // Close on any click inside the overlay
    easterEggModal.addEventListener('click', hideEasterEgg, { once: true });
  }

  function hideEasterEgg() {
    easterEggModal.classList.remove('show');
    
    // (Optional) Stop the rotation animation when closing
    if (rotateAnimationId) {
      cancelAnimationFrame(rotateAnimationId);
      rotateAnimationId = null;
    }
  }
})();


});
