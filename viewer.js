/* ============================================================
   Design Viewer — auto-init component
   Drop a <div class="design-viewer" data-...> into any page.
   On DOMContentLoaded, every such element is replaced with a
   fully wired viewer. Multiple viewers per page are supported.
   ============================================================ */

(function () {
  'use strict';

  // SVG icon strings — kept here so viewer.js is self-contained
  var ICONS = {
    desktop: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    mobile: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    fsExpand: '<svg class="dv-icon-expand" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    fsCollapse: '<svg class="dv-icon-collapse" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'
  };

  // Track all viewer instances so resize handler can update them all
  var viewers = [];

  // ---------- Build a single viewer ----------
  function buildViewer(root) {
    // Parse data attributes
    var basePath = (root.getAttribute('data-base') || '').replace(/\/$/, '');
    var desktopLight = parseList(root.getAttribute('data-desktop-light'));
    var desktopDark  = parseList(root.getAttribute('data-desktop-dark'));
    var mobileLight  = parseList(root.getAttribute('data-mobile-light'));
    var mobileDark   = parseList(root.getAttribute('data-mobile-dark'));

    // Build {light, dark} pair arrays
    var desktop = pairImages(basePath, 'desktop', desktopLight, desktopDark);
    var mobile  = pairImages(basePath, 'mobile', mobileLight,  mobileDark);

    // Render the markup
    root.innerHTML = renderMarkup();

    // Cache element refs scoped to this viewer
    var els = {
      stage:        root.querySelector('.dv-stage'),
      btnDesktop:   root.querySelector('.dv-btn-desktop'),
      btnMobile:    root.querySelector('.dv-btn-mobile'),
      btnLight:     root.querySelector('.dv-btn-light'),
      btnDark:      root.querySelector('.dv-btn-dark'),
      fsBtnDesktop: root.querySelector('.dv-fs-btn-desktop'),
      fsBtnMobile:  root.querySelector('.dv-fs-btn-mobile'),
      fsBtnLight:   root.querySelector('.dv-fs-btn-light'),
      fsBtnDark:    root.querySelector('.dv-fs-btn-dark'),
      desktopView:  root.querySelector('.dv-desktop-view'),
      desktopImg:   root.querySelector('.dv-desktop-img'),
      desktopPrev:  root.querySelector('.dv-desktop-prev'),
      desktopNext:  root.querySelector('.dv-desktop-next'),
      desktopCount: root.querySelector('.dv-desktop-counter'),
      mobileView:   root.querySelector('.dv-mobile-view'),
      mobileArrows: root.querySelector('.dv-mobile-arrows'),
      mobilePrev:   root.querySelector('.dv-mobile-prev'),
      mobileNext:   root.querySelector('.dv-mobile-next'),
      mobileCount:  root.querySelector('.dv-mobile-counter'),
      phones: [
        root.querySelector('.dv-phone-screen[data-idx="0"]'),
        root.querySelector('.dv-phone-screen[data-idx="1"]'),
        root.querySelector('.dv-phone-screen[data-idx="2"]')
      ],
      fsBtn:        root.querySelector('.dv-fs-btn')
    };

    // Per-viewer state
    var state = {
      di: 0,
      mi: 0,
      mode: 'light',
      device: 'desktop',
      phonesShown: calcPhonesShown(),
      desktop: desktop,
      mobile: mobile,
      els: els,
      root: root
    };

    // Wire up event handlers
    els.btnDesktop.addEventListener('click',   function () { setDevice(state, 'desktop'); });
    els.btnMobile.addEventListener('click',    function () { setDevice(state, 'mobile'); });
    els.btnLight.addEventListener('click',     function () { setMode(state, 'light'); });
    els.btnDark.addEventListener('click',      function () { setMode(state, 'dark'); });
    els.fsBtnDesktop.addEventListener('click', function () { setDevice(state, 'desktop'); });
    els.fsBtnMobile.addEventListener('click',  function () { setDevice(state, 'mobile'); });
    els.fsBtnLight.addEventListener('click',   function () { setMode(state, 'light'); });
    els.fsBtnDark.addEventListener('click',    function () { setMode(state, 'dark'); });

    els.desktopPrev.addEventListener('click', function () { navigate(state, 'desktop', -1); });
    els.desktopNext.addEventListener('click', function () { navigate(state, 'desktop',  1); });
    els.mobilePrev.addEventListener('click',  function () { navigate(state, 'mobile',  -1); });
    els.mobileNext.addEventListener('click',  function () { navigate(state, 'mobile',   1); });

    els.fsBtn.addEventListener('click', function () { toggleFullscreen(state); });

    // Initial render
    applyPhoneVisibility(state);
    setDevice(state, 'desktop');
    setMode(state, 'light');
    refreshMobile(state);

    return state;
  }

  // ---------- Helpers ----------
  function parseList(str) {
    if (!str) return [];
    return str.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function pairImages(basePath, device, lightList, darkList) {
    var n = Math.min(lightList.length, darkList.length);
    var result = [];
    for (var i = 0; i < n; i++) {
      result.push({
        light: basePath + '/' + device + '/light/' + lightList[i] + '.png',
        dark:  basePath + '/' + device + '/dark/'  + darkList[i]  + '.png'
      });
    }
    return result;
  }

  function calcPhonesShown() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  // ---------- State updates ----------
  function setDevice(s, d) {
    s.device = d;
    s.els.desktopView.style.display = d === 'desktop' ? 'flex' : 'none';
    s.els.mobileView.style.display  = d === 'mobile'  ? 'flex' : 'none';
    s.els.mobileArrows.style.display = d === 'mobile' ? 'flex' : 'none';
    var idx = d === 'desktop' ? 0 : 1;
    s.els.btnDesktop.classList.toggle('is-active', d === 'desktop');
    s.els.btnMobile.classList.toggle('is-active',  d === 'mobile');
    s.els.fsBtnDesktop.classList.toggle('is-active', d === 'desktop');
    s.els.fsBtnMobile.classList.toggle('is-active',  d === 'mobile');
    s.els.btnDesktop.parentNode.setAttribute('data-active', idx);
    s.els.fsBtnDesktop.parentNode.setAttribute('data-active', idx);
  }

  function setMode(s, m) {
    s.mode = m;
    var idx = m === 'light' ? 0 : 1;
    s.els.btnLight.classList.toggle('is-active', m === 'light');
    s.els.btnDark.classList.toggle('is-active',  m === 'dark');
    s.els.fsBtnLight.classList.toggle('is-active', m === 'light');
    s.els.fsBtnDark.classList.toggle('is-active',  m === 'dark');
    s.els.btnLight.parentNode.setAttribute('data-active', idx);
    s.els.fsBtnLight.parentNode.setAttribute('data-active', idx);
    s.els.stage.classList.toggle('is-light-stage', m === 'dark'); // dark designs sit on a LIGHT stage
    refreshDesktop(s);
    refreshMobile(s);
  }

  function refreshDesktop(s) {
    if (!s.desktop.length) return;
    var screen = s.desktop[s.di];
    s.els.desktopImg.src = s.mode === 'light' ? screen.light : screen.dark;
    s.els.desktopCount.textContent = (s.di + 1) + ' / ' + s.desktop.length;
    s.els.desktopPrev.disabled = s.di === 0;
    s.els.desktopNext.disabled = s.di === s.desktop.length - 1;
  }

  function refreshMobile(s) {
    if (!s.mobile.length) return;
    for (var i = 0; i < s.phonesShown; i++) {
      var screen = s.mobile[s.mi + i];
      if (!screen) continue;
      var src = s.mode === 'light' ? screen.light : screen.dark;
      s.els.phones[i].innerHTML = '<img src="' + src + '" alt="screen">';
    }
    var lastShown = Math.min(s.mi + s.phonesShown, s.mobile.length);
    s.els.mobileCount.textContent = s.phonesShown === 1
      ? (s.mi + 1) + ' / ' + s.mobile.length
      : (s.mi + 1) + '-' + lastShown + ' / ' + s.mobile.length;
    s.els.mobilePrev.disabled = s.mi === 0;
    s.els.mobileNext.disabled = s.mi >= s.mobile.length - s.phonesShown;
  }

  function applyPhoneVisibility(s) {
    for (var i = 0; i < 3; i++) {
      var phone = s.els.phones[i].parentNode; // .dv-phone wrapper
      if (i < s.phonesShown) phone.classList.remove('is-hidden');
      else phone.classList.add('is-hidden');
    }
  }

  function navigate(s, device, dir) {
    if (device === 'desktop') {
      s.di = Math.max(0, Math.min(s.desktop.length - 1, s.di + dir));
      refreshDesktop(s);
    } else {
      s.mi = Math.max(0, Math.min(s.mobile.length - s.phonesShown, s.mi + dir));
      refreshMobile(s);
    }
  }

  function toggleFullscreen(s) {
    var stage = s.els.stage;
    var isNativeFs = document.fullscreenElement === stage;
    var isCssFs = stage.classList.contains('is-fullscreen');

    if (isNativeFs) { document.exitFullscreen(); return; }
    if (isCssFs)    { stage.classList.remove('is-fullscreen'); return; }

    if (stage.requestFullscreen) {
      stage.requestFullscreen().catch(function () {
        stage.classList.add('is-fullscreen');
      });
    } else {
      stage.classList.add('is-fullscreen');
    }
  }

  // ---------- Markup template ----------
  function renderMarkup() {
    return '' +
      '<div class="dv-controls">' +
        '<div class="dv-group" data-active="0">' +
          '<button class="dv-btn dv-btn-desktop is-active" type="button">' + ICONS.desktop + 'Desktop</button>' +
          '<button class="dv-btn dv-btn-mobile" type="button">' + ICONS.mobile + 'Mobile</button>' +
        '</div>' +
        '<div class="dv-group" data-active="0">' +
          '<button class="dv-btn dv-btn-light is-active" type="button">' + ICONS.sun + 'Light</button>' +
          '<button class="dv-btn dv-btn-dark" type="button">' + ICONS.moon + 'Dark</button>' +
        '</div>' +
      '</div>' +
      '<div class="dv-stage">' +
        '<div class="dv-desktop-view">' +
          '<div class="dv-desktop-screen"><img class="dv-desktop-img" src="" alt="Desktop screen"></div>' +
          '<div class="dv-nav">' +
            '<button class="dv-arrow dv-desktop-prev is-prev" type="button" disabled>' + ICONS.arrowLeft + '</button>' +
            '<span class="dv-counter dv-desktop-counter">1 / 1</span>' +
            '<button class="dv-arrow dv-desktop-next is-next" type="button">' + ICONS.arrowRight + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="dv-mobile-view">' +
          '<div class="dv-phone"><div class="dv-phone-screen" data-idx="0"></div></div>' +
          '<div class="dv-phone"><div class="dv-phone-screen" data-idx="1"></div></div>' +
          '<div class="dv-phone"><div class="dv-phone-screen" data-idx="2"></div></div>' +
        '</div>' +
        '<div class="dv-nav dv-mobile-arrows" style="display:none;">' +
          '<button class="dv-arrow dv-mobile-prev is-prev" type="button" disabled>' + ICONS.arrowLeft + '</button>' +
          '<span class="dv-counter dv-mobile-counter">1 / 1</span>' +
          '<button class="dv-arrow dv-mobile-next is-next" type="button">' + ICONS.arrowRight + '</button>' +
        '</div>' +
        '<button class="dv-fs-btn" type="button" aria-label="Toggle fullscreen">' +
          ICONS.fsExpand +
          ICONS.fsCollapse +
        '</button>' +
        '<div class="dv-fs-overlay">' +
          '<div class="dv-group" data-active="0">' +
            '<button class="dv-btn dv-fs-btn-desktop is-active" type="button">' + ICONS.desktop + 'Desktop</button>' +
            '<button class="dv-btn dv-fs-btn-mobile" type="button">' + ICONS.mobile + 'Mobile</button>' +
          '</div>' +
          '<div class="dv-group" data-active="0">' +
            '<button class="dv-btn dv-fs-btn-light is-active" type="button">' + ICONS.sun + 'Light</button>' +
            '<button class="dv-btn dv-fs-btn-dark" type="button">' + ICONS.moon + 'Dark</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ---------- Global listeners (one set, applied to all viewers) ----------
  window.addEventListener('resize', function () {
    var newCount = calcPhonesShown();
    viewers.forEach(function (s) {
      if (newCount !== s.phonesShown) {
        s.phonesShown = newCount;
        s.mi = Math.min(s.mi, s.mobile.length - s.phonesShown);
        s.mi = Math.max(0, s.mi);
        applyPhoneVisibility(s);
        refreshMobile(s);
      }
    });
  });

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      // Native FS exited — clear css-fs class on any viewer that had it (safety)
      viewers.forEach(function (s) { s.els.stage.classList.remove('is-fullscreen'); });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.fullscreenElement) return; // browser handles native FS
    viewers.forEach(function (s) {
      s.els.stage.classList.remove('is-fullscreen');
    });
  });

  // ---------- Auto-init on DOMContentLoaded ----------
  function init() {
    var roots = document.querySelectorAll('.design-viewer');
    for (var i = 0; i < roots.length; i++) {
      // Skip if already initialized (defensive — calling init twice should be safe)
      if (roots[i].getAttribute('data-dv-initialized')) continue;
      var s = buildViewer(roots[i]);
      roots[i].setAttribute('data-dv-initialized', 'true');
      viewers.push(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();