document.addEventListener('DOMContentLoaded', () => {
  /********************************
   * DECORATION DOWNLOAD
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
   * COMMISSION LINKS (GREEN => PURPLE)
   ********************************/
  const commissionLinks = document.querySelectorAll('.commission-link');
  commissionLinks.forEach(link => {
    // on load, check localStorage
    if (localStorage.getItem(`clicked-${link.href}`) === 'true') {
      link.classList.add('clicked'); // purple
    }
    link.addEventListener('click', () => {
      link.classList.add('clicked');
      localStorage.setItem(`clicked-${link.href}`, 'true');
    });
  });

  /********************************
   * CONFETTI (OPTIONAL)
   ********************************/
  const confettiContainer = document.querySelector('.confetti-container');
  if (confettiContainer) {
    function spawnConfettiPiece() {
      const confetti = document.createElement('img');
      // adjust path
      confetti.src = 'styles/heart-confetti.png';
      confetti.classList.add('confetti-piece');

      const size = Math.floor(Math.random() * 20) + 30;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;

      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-50px';

      const smallDelay = Math.random() * 0.5;
      confetti.style.animationDelay = `${smallDelay}s`;

      const duration = 10 + Math.random() * 10;
      confetti.style.animationDuration = `${duration}s`;

      // random clockwise vs. counterclockwise
      confetti.style.animationName = Math.random() < 0.5 ? 'confettiDriftCW' : 'confettiDriftCCW';

      confetti.addEventListener('animationend', () => {
        confettiContainer.removeChild(confetti);
      });

      confettiContainer.appendChild(confetti);
    }

    // spawn some right away
    for (let i = 0; i < 5; i++) {
      spawnConfettiPiece();
    }
    // then spawn 1 piece each second
    setInterval(spawnConfettiPiece, 1000);
  }

  /********************************
   * SPARKLY MOUSE TRAIL (OPTIONAL)
   ********************************/
  window.addEventListener('mousemove', function(e) {
    const arr = [1, 0.9, 0.8, 0.5, 0.2];
    arr.forEach(function(i) {
      const x = (1 - i) * 75;
      const star = document.createElement('div');
      star.className = 'star';

      star.style.top = e.clientY + Math.round(Math.random() * x - x / 2) + 'px';
      star.style.left = e.clientX + Math.round(Math.random() * x - x / 2) + 'px';

      document.body.appendChild(star);

      window.setTimeout(function() {
        document.body.removeChild(star);
      }, Math.round(Math.random() * i * 600));
    });
  }, false);
});
