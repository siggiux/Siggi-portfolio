/* ============================================================
   V3 SITE SCRIPTS — shared by the V3 (Quiet) sub-pages.
   Theme toggle, mobile menu, scroll reveal, accordion, TOC.
   Replaces ../script.js for these pages (the old toggleTheme
   expects the moon/sun icon markup that V3 doesn't use).
============================================================ */

/* ── Theme toggle (body.dark, shared localStorage key with the homepage) ──
   The new theme sweeps out as a circle from the toggle (View Transitions
   API). Browsers without it, and reduced-motion users, get the plain fade. */
function toggleTheme() {
  var apply = function () {
    var isDark = document.body.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  };
  var btn = document.querySelector('.theme-toggle');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce || !btn) { apply(); return; }
  /* going dark: darkness grows out of the toggle (new view expands).
     going light: darkness gets sucked back into it (old view collapses). */
  var goingDark = !document.body.classList.contains('dark');
  var r = btn.getBoundingClientRect();
  var x = r.left + r.width / 2, y = r.top + r.height / 2;
  var endR = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  var closed = 'circle(0px at ' + x + 'px ' + y + 'px)';
  var open = 'circle(' + endR + 'px at ' + x + 'px ' + y + 'px)';
  /* suppress the CSS fades while the wipe runs — the reveal IS the animation,
     and a half-faded background inside the circle would look muddy */
  document.documentElement.classList.add('theme-wipe');
  if (!goingDark) document.documentElement.classList.add('theme-wipe--out');
  var vt = document.startViewTransition(apply);
  vt.ready.then(function () {
    document.documentElement.animate(
      { clipPath: goingDark ? [closed, open] : [open, closed] },
      {
        duration: 980,
        easing: 'linear', /* constant tempo edge to edge */
        fill: 'forwards',
        pseudoElement: goingDark ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    );
  });
  var done = function () {
    document.documentElement.classList.remove('theme-wipe');
    document.documentElement.classList.remove('theme-wipe--out');
  };
  vt.finished.then(done, done);
}
try {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
} catch (e) {}

/* ── Mobile menu ── */
function toggleMenu() {
  var open = document.body.classList.toggle('nav-open');
  var btn = document.querySelector('.nav-toggle');
  if (btn) btn.setAttribute('aria-expanded', open);
}
document.querySelectorAll('.nav-links a').forEach(function (a) {
  a.addEventListener('click', function () {
    document.body.classList.remove('nav-open');
    var btn = document.querySelector('.nav-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
});
window.addEventListener('resize', function () {
  if (window.innerWidth > 900 && document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open');
    var btn = document.querySelector('.nav-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
});

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

/* ── Accordion (case study 1) ── */
function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  var isOpen = body.classList.contains('open');
  document.querySelectorAll('.cs-accordion-body').forEach(function (b) { b.classList.remove('open'); });
  document.querySelectorAll('.cs-accordion-btn').forEach(function (b) { b.classList.remove('open'); });
  if (!isOpen) {
    body.classList.add('open');
    btn.classList.add('open');
  }
}

/* ── Table of contents active state ── */
(function () {
  var sections = document.querySelectorAll('.cs-section');
  var tocItems = document.querySelectorAll('.toc-item');
  if (!sections.length || !tocItems.length) return;
  var tocObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        tocItems.forEach(function (item) {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(function (s) { tocObserver.observe(s); });
})();
