(function () {
  var header = document.getElementById('header');
  var menu = document.getElementById('mobile-menu');
  var openButton = document.getElementById('menu-open');
  var closeButton = document.getElementById('menu-close');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-lock', open);
  }

  openButton.addEventListener('click', function () { setMenu(true); });
  closeButton.addEventListener('click', function () { setMenu(false); });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  window.addEventListener('scroll', function () {
    header.classList.toggle('compact', window.scrollY > 24);
  }, { passive: true });

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (item) {
        item.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.price-panel').forEach(function (panel) {
        panel.classList.remove('active');
        panel.hidden = true;
      });
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('panel-' + tab.dataset.panel);
      panel.hidden = false;
      panel.classList.add('active');
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (item) { observer.observe(item); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (item) { item.classList.add('visible'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
}());
