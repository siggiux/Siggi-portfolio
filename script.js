/* ================================
   SIGGI — SCRIPTS
================================ */

/* ── Dark mode toggle ── */
const themeBtn = document.getElementById('theme-btn');
const iconMoon = document.getElementById('icon-moon');
const iconSun  = document.getElementById('icon-sun');

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');

  // Swap icon
  iconMoon.style.display = isDark ? 'none'  : 'block';
  iconSun.style.display  = isDark ? 'block' : 'none';

  // Remember preference so it persists on page refresh
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// On page load — apply saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  iconMoon.style.display = 'none';
  iconSun.style.display  = 'block';
}

/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const cards  = document.querySelectorAll('.card');

// Cursor follows mouse position
document.addEventListener('mousemove', function(e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// Show cursor when hovering a card
cards.forEach(function(card) {
  card.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
  });
  card.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
  });
});