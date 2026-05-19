/* ================================
   SIGGI — SCRIPTS
================================ */

/* ── Scroll reveal ── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── Dark mode toggle ── */
var themeBtn = document.getElementById('theme-btn');
var iconMoon = document.getElementById('icon-moon');
var iconSun  = document.getElementById('icon-sun');

function toggleTheme() {
  var isDark = document.body.classList.toggle('dark');
  if (iconMoon && iconSun) {
    iconMoon.style.display = isDark ? 'none'  : 'block';
    iconSun.style.display  = isDark ? 'block' : 'none';
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Apply saved preference on load
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  if (iconMoon && iconSun) {
    iconMoon.style.display = 'none';
    iconSun.style.display  = 'block';
  }
}

/* ── Custom cursor ── */
var cursor = document.getElementById('cursor');
var cards  = document.querySelectorAll('.card');

if (cursor) {
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });
    card.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
  });
}

/* ── Accordion ── */
function toggleAccordion(btn) {
  var body   = btn.nextElementSibling;
  var isOpen = body.classList.contains('open');
  document.querySelectorAll('.cs-accordion-body').forEach(function (b) { b.classList.remove('open'); });
  document.querySelectorAll('.cs-accordion-btn').forEach(function (b) { b.classList.remove('open'); });
  if (!isOpen) {
    body.classList.add('open');
    btn.classList.add('open');
  }
}

/* ── Table of contents — Intersection Observer ── */
var sections = document.querySelectorAll('.cs-section');
var tocItems = document.querySelectorAll('.toc-item');

if (sections.length > 0 && tocItems.length > 0) {
  var tocObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        tocItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.dataset.section === id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function (section) { tocObserver.observe(section); });
}
