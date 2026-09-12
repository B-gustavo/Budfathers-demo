// THE BUDFATHERS — site scripts
document.addEventListener('DOMContentLoaded', function () {

  /* header scroll state */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  if (header) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }

  /* mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* locations filter */
  var filterBtns = document.querySelectorAll('.loc-filter button');
  var locCards = document.querySelectorAll('.loc-card');
  if (filterBtns.length && locCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var region = btn.getAttribute('data-region');
        locCards.forEach(function (card) {
          var match = region === 'all' || card.getAttribute('data-region') === region;
          card.parentElement.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* contact / membership form — demo only, no backend wired up */
  var forms = document.querySelectorAll('form[data-demo-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-success');
      form.querySelectorAll('input,textarea,select').forEach(function (f) { f.disabled = true; });
      if (msg) msg.style.display = 'block';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Message Sent'; btn.disabled = true; }
    });
  });

  /* footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initEntryGate();
  initPreferences();
});

/* ==========================================================================
   ENTRY GATE — smoke intro -> 21+ check -> theme pick on the landing page;
   a compact 21+ check alone on every other page. The gate markup lives in
   the HTML from first paint (zero flash); a tiny inline script right after
   it already hid it instantly for anyone who has passed the check before —
   this function only runs the interactive parts for first-time visitors.
   ========================================================================== */
function initEntryGate () {
  var gate = document.getElementById('entry-gate');
  if (!gate || gate.style.display === 'none') return;

  document.body.classList.add('gate-locked');
  var isLanding = gate.classList.contains('entry-gate--landing');

  var steps = {
    smoke: gate.querySelector('.entry-step--smoke'),
    age: gate.querySelector('.entry-step--age'),
    theme: gate.querySelector('.entry-step--theme'),
    blocked: gate.querySelector('.entry-step--blocked')
  };

  function showStep (name) {
    Object.keys(steps).forEach(function (k) {
      if (steps[k]) steps[k].classList.toggle('active', k === name);
    });
  }

  function hideGate () {
    gate.classList.add('is-hiding');
    document.body.classList.remove('gate-locked');
    setTimeout(function () { gate.style.display = 'none'; }, 750);
  }

  if (isLanding && steps.smoke) {
    showStep('smoke');
    setTimeout(function () { showStep('age'); }, 2400);
  } else {
    showStep('age');
  }

  var yesBtn = gate.querySelector('[data-gate-yes]');
  var noBtn = gate.querySelector('[data-gate-no]');

  if (yesBtn) yesBtn.addEventListener('click', function () {
    try { localStorage.setItem('bf_age_ok', '1'); } catch (e) {}
    if (isLanding && steps.theme) showStep('theme');
    else hideGate();
  });

  if (noBtn) noBtn.addEventListener('click', function () {
    showStep('blocked');
  });

  gate.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme-choice'));
      hideGate();
    });
  });
}

/* Shared by the gate's theme step and the Preferences panel */
function applyTheme (theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('bf_theme', theme); } catch (e) {}
  document.querySelectorAll('.theme-choice[data-theme-choice]').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === theme);
  });
  /* the logo artwork is light-coloured for the dark theme; swap in the
     dark-coloured variant so it stays legible on the light background */
  document.querySelectorAll('img[src*="logo-real"]').forEach(function (img) {
    img.src = theme === 'light' ? 'assets/photos/logo-real-dark.png' : 'assets/photos/logo-real.png';
  });
}

/* ==========================================================================
   PREFERENCES — floating gear button + slide-in panel, injected on every
   page so appearance and language stay one tap away site-wide.
   ========================================================================== */
function initPreferences () {
  var storedTheme = 'dark', storedLang = 'en';
  try { storedTheme = localStorage.getItem('bf_theme') || 'dark'; } catch (e) {}
  try { storedLang = localStorage.getItem('bf_lang') || 'en'; } catch (e) {}

  var overlay = document.createElement('div');
  overlay.className = 'prefs-overlay';

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'prefs-toggle';
  toggle.setAttribute('aria-label', 'Preferences');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'prefs-panel';

  var names = window.BF_LANG_NAMES || { en: 'English (SA)' };
  var langOptions = Object.keys(names).map(function (code) {
    return '<option value="' + code + '">' + names[code] + '</option>';
  }).join('');

  panel.innerHTML =
    '<div class="prefs-head"><span data-i18n="prefs.title">Preferences</span>' +
      '<button type="button" class="prefs-close" aria-label="Close">&times;</button></div>' +
    '<div class="prefs-row">' +
      '<label data-i18n="prefs.appearance">Appearance</label>' +
      '<div class="theme-choice-row">' +
        '<button type="button" class="theme-choice" data-theme-choice="dark">' +
          '<span class="theme-swatch theme-swatch--dark"></span><span data-i18n="prefs.dark">Dark</span></button>' +
        '<button type="button" class="theme-choice" data-theme-choice="light">' +
          '<span class="theme-swatch theme-swatch--light"></span><span data-i18n="prefs.light">Light</span></button>' +
      '</div>' +
    '</div>' +
    '<div class="prefs-row">' +
      '<label for="prefs-lang" data-i18n="prefs.language">Language</label>' +
      '<select id="prefs-lang">' + langOptions + '</select>' +
    '</div>' +
    '<p class="prefs-note" data-i18n="prefs.note">Your choices are saved on this device for next time.</p>';

  document.body.appendChild(overlay);
  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  function openPanel () { panel.classList.add('open'); overlay.classList.add('open'); }
  function closePanel () { panel.classList.remove('open'); overlay.classList.remove('open'); }

  toggle.addEventListener('click', openPanel);
  overlay.addEventListener('click', closePanel);
  panel.querySelector('.prefs-close').addEventListener('click', closePanel);

  panel.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyTheme(btn.getAttribute('data-theme-choice')); });
  });

  var langSelect = panel.querySelector('#prefs-lang');
  langSelect.value = storedLang;
  langSelect.addEventListener('change', function () {
    if (window.bfApplyLanguage) window.bfApplyLanguage(langSelect.value);
  });

  applyTheme(storedTheme);
  if (window.bfApplyLanguage) window.bfApplyLanguage(storedLang);
}
