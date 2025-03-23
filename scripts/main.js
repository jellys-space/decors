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
    // Point this to your actual jelly-confetti image
    confetti.src = 'styles/jelly-confetti.png';
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
    confetti.style.top = '-50px';  // just above the viewport

    // Minimal random delay (0–0.5s) => starts quickly
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

});
