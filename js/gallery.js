// Studio406 gallery lightbox — no dependencies.
(function () {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const big = box.querySelector('img');

  function open(src) {
    big.src = src;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    big.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-grid img').forEach(function (img) {
    img.addEventListener('click', function () { open(img.src); });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
