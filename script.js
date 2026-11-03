/* ===== ГАЛЕРЕЯ — редактируйте здесь =====
   Как добавить работу: положите файл в папку категории
   (assets/avatars, assets/banners, assets/web) и добавьте строку в items:
   { file: 'имя-файла.jpg', title: 'Название' }
   Необязательно: pos: '50% 0%' — какую часть картинки показывать в превью.
   Если items пустой — показываются демо-заглушки (с пометкой DEMO). */
const GALLERY = [
  { id: 'avatars', label: 'AVATARS', desc: 'Игровые и персональные аватары.', ar: '1/1', dir: 'assets/avatars/', items: [
    { file: 'avatar-1.jpg', title: 'Avatar 01' },
    { file: 'avatar-2.jpg', title: 'Avatar 02' },
    { file: 'avatar-3.jpg', title: 'Avatar 03' },
  ]},
  { id: 'banners', label: 'BANNERS', desc: 'Баннеры и обложки для социальных сетей.', ar: '16/9', dir: 'assets/banners/', items: [
    { file: 'banner-1.jpg', title: 'Banner 01' },
    { file: 'banner-2.jpg', title: 'Banner 02' },
  ]},
  { id: 'web', label: 'WEB DESIGN', desc: 'Сайты, лендинги и сайты-визитки.', ar: '16/10', dir: 'assets/web/', items: [
    { file: 'web-1.jpg', title: 'Web design 01', pos: '50% 18%' },
  ]},
];

const SHAPES = [
  '<circle cx="200" cy="150" r="70" fill="none" stroke="currentColor"/><circle cx="200" cy="150" r="40" fill="none" stroke="currentColor"/><circle cx="200" cy="150" r="8" fill="currentColor"/>',
  '<path d="M0 220 120 90l80 80 60-50 140 100" fill="none" stroke="currentColor"/><rect x="40" y="40" width="320" height="220" fill="none" stroke="currentColor" opacity=".5"/>',
  '<rect x="60" y="60" width="280" height="180" rx="10" fill="none" stroke="currentColor"/><path d="M60 100h280M100 140h120M100 170h80" stroke="currentColor"/><circle cx="82" cy="80" r="4" fill="currentColor"/>',
];
const ph = i => `<svg class="ph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SHAPES[i % SHAPES.length]}</svg>`;

const tabs = document.getElementById('tabs'), grid = document.getElementById('works');
const lb = document.getElementById('lightbox'), lbMedia = document.getElementById('lbMedia');
let cur = GALLERY[0];

const mediaHTML = (it, cat, i) => it.file
  ? `<img src="${cat.dir}${it.file}" alt="${it.title || cat.label}" loading="lazy" decoding="async" style="object-position:${it.pos || '50% 50%'}">`
  : ph(i);

function show(cat) {
  cur = cat;
  tabs.querySelectorAll('.tab').forEach(t => { const on = t.dataset.id === cat.id; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  grid.dataset.cat = cat.id; grid.style.setProperty('--ar', cat.ar);
  const items = cat.items.length ? cat.items : [{}, {}, {}];
  grid.innerHTML = items.map((it, i) => `
    <button class="work" style="--d:${i * .07}s" data-i="${i}" aria-label="Открыть: ${it.title || cat.label}">
      ${mediaHTML(it, cat, i)}
      <div class="cap"><div><h3>${cat.label}</h3><small>${it.title || cat.desc}</small></div>${it.file ? '' : '<span class="demo">DEMO</span>'}</div>
    </button>`).join('');
}
tabs.innerHTML = GALLERY.map(c => `<button class="tab" role="tab" data-id="${c.id}">${c.label}</button>`).join('');
tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) show(GALLERY.find(c => c.id === t.dataset.id)); });
show(cur);

// Если файл не найден — вместо картинки показываем заглушку
grid.addEventListener('error', e => {
  if (e.target.tagName !== 'IMG') return;
  const w = e.target.closest('.work'); e.target.outerHTML = ph(+w.dataset.i);
  w.querySelector('.cap').insertAdjacentHTML('beforeend', '<span class="demo">DEMO</span>');
}, true);

// Увеличенный просмотр
grid.addEventListener('click', e => {
  const b = e.target.closest('.work'); if (!b) return;
  const i = +b.dataset.i, it = cur.items[i] || {};
  lbMedia.innerHTML = mediaHTML(it, cur, i);
  const img = lbMedia.querySelector('img');
  if (img) { img.removeAttribute('loading'); img.style.objectPosition = ''; img.onload = () => img.classList.toggle('tall', img.naturalHeight / img.naturalWidth > 1.6); }
  document.getElementById('lbCat').textContent = cur.label;
  document.getElementById('lbTitle').textContent = it.title || cur.label;
  document.getElementById('lbDesc').textContent = it.file ? cur.desc : cur.desc + ' (демо-заглушка)';
  lb.showModal();
});
document.getElementById('lbClose').onclick = () => lb.close();
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

// Мобильное меню
const burger = document.getElementById('burger'), nav = document.getElementById('nav');
const setMenu = open => {
  nav.classList.toggle('open', open); burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
};
burger.onclick = () => setMenu(!nav.classList.contains('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Шапка при прокрутке
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Появление элементов
document.querySelectorAll('.hero .reveal').forEach((el, i) => el.style.setProperty('--d', `${.15 + i * .15}s`));
document.querySelectorAll('.cards .reveal, .socials.reveal').forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * .1}s`));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
