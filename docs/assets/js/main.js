// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Flip cards: hover already flips them via CSS on devices with a mouse.
// On touch devices (no hover), tap toggles the flip instead.
const isTouch = window.matchMedia('(hover: none)').matches;
if (isTouch) {
  document.querySelectorAll('.flip-card').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });
}
