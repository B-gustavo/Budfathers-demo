// THE BUDFATHERS — site scripts
document.addEventListener('DOMContentLoaded', function () {

  /* header scroll state */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
});
