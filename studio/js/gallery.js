// Studio406 gallery lightbox — no dependencies.
(function () {
  // Fade thumbnails in as they load, instead of popping in abruptly.
  document.querySelectorAll('.gallery-grid img').forEach(function (img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); });
    }
  });

  const box = document.getElementById('lightbox');
  if (!box) return;
  const big = box.querySelector('img');
  let scrollY = 0;

  // overflow:hidden alone doesn't stop touch-scroll on iOS Safari — pinning
  // the body with position:fixed is what actually locks the page behind.
  function open(src) {
    big.src = src;
    box.classList.add('open');
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -scrollY + 'px';
    document.body.style.width = '100%';
  }
  function close() {
    box.classList.remove('open');
    big.src = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  document.querySelectorAll('.gallery-grid img').forEach(function (img) {
    img.addEventListener('click', function () { open(img.src); });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
