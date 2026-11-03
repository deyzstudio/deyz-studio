/* ===== НАСТРОЙКИ — замените значения на свои ===== */
const CONFIG = {
  TELEGRAM_USERNAME: 'deyz888',          // без @, например 'deyz_studio'
  TELEGRAM_CHANNEL_LINK: 'TELEGRAM_CHANNEL_LINK'   // полная ссылка, например 'https://t.me/deyz_channel'
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* --- Telegram: заказы --- */
const orderUrl = service =>
  `https://t.me/${CONFIG.TELEGRAM_USERNAME}?text=${encodeURIComponent('Здравствуйте! Хочу сделать заказ: ' + service)}`;

$$('[data-order]').forEach(a => {
  a.href = orderUrl(a.dataset.order);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
if (CONFIG.TELEGRAM_USERNAME === 'TELEGRAM_USERNAME') {
  console.warn('DEYZ STUDIO: укажите TELEGRAM_USERNAME в script.js — иначе кнопки «Заказать» ведут на несуществующий аккаунт.');
}

/* --- Telegram: канал --- */
const channelOk = /^https?:\/\//.test(CONFIG.TELEGRAM_CHANNEL_LINK);
$$('[data-channel]').forEach(a => {
  if (channelOk) {
    a.href = CONFIG.TELEGRAM_CHANNEL_LINK;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  } else {
    a.addEventListener('click', e => {
      e.preventDefault();
      console.warn('DEYZ STUDIO: укажите TELEGRAM_CHANNEL_LINK в script.js.');
    });
  }
});

/* --- Отзывы (демо) --- */
const REVIEWS = [
  ['Алексей К.', 'Получилось даже лучше, чем ожидал!'],
  ['Мария С.', 'Очень понравился результат, спасибо.'],
  ['Дмитрий В.', 'Быстро, качественно и красиво.'],
  ['Анна П.', 'Всё сделали именно так, как хотел.'],
  ['Никита Л.', 'Отличная работа, обязательно обращусь ещё.'],
  ['Екатерина М.', 'Аватар огонь — теперь все спрашивают, кто делал.'],
  ['Максим Т.', 'Баннер для канала вышел стильным, подписчики оценили.'],
  ['Дарья Н.', 'Презентация выглядит дорого, на защите все были в восторге.'],
  ['Артём Ж.', 'Учли каждую мелочь из моего описания.'],
  ['Ольга Р.', 'Приятно общаться: всё объяснили и показали варианты.'],
  ['Иван Б.', 'Правки внесли за пару минут, без лишних вопросов.'],
  ['Полина Г.', 'Не ожидала такого уровня за такую цену.'],
  ['Кирилл Д.', 'Сайт получился лёгким и современным, как и просил.'],
  ['София Е.', 'Сдали раньше срока, а результат превзошёл ожидания.'],
  ['Егор А.', 'Аккуратная работа и чёткие цвета, всё читается.'],
  ['Виктория О.', 'Уже заказываю второй баннер, рекомендую.'],
  ['Роман Ф.', 'Чувствуется вкус и внимание к деталям.'],
  ['Елизавета Ч.', 'Лучший дизайн для моего проекта, спасибо!']
];
const revs = $('#revs');
revs.innerHTML = REVIEWS.map(([name, text]) => `
  <article class="rev rv">
    <div class="stars" role="img" aria-label="Оценка 5 из 5">★★★★★</div>
    <p>${text}</p>
    <footer><span class="av" aria-hidden="true">${name[0]}</span>${name}</footer>
  </article>`).join('');

const revMore = $('#revMore');
revMore.addEventListener('click', () => {
  const open = revs.classList.toggle('all');
  revMore.setAttribute('aria-expanded', open);
  revMore.textContent = open ? 'Свернуть' : 'Показать все отзывы';
  if (open) $$('.rev', revs).forEach(el => el.classList.remove('rv'));
  else $('#reviews').scrollIntoView({ block: 'start' });
});

/* --- FAQ: аккордеон --- */
$$('.qa button').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.parentElement;
  const open = !item.classList.contains('open');
  item.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}));

/* --- Появление при прокрутке --- */
/* после появления класс rv снимается, чтобы вернуть hover-переходы карточек */
const reveal = el => {
  el.classList.add('in');
  if (el.classList.contains('rv')) el.addEventListener('transitionend', e => {
    if (e.target === el && e.propertyName === 'opacity') el.classList.remove('rv');
  });
};
const items = $$('.rv, .sh');
const groups = new Map();
items.forEach(el => {
  const p = el.parentElement;
  const i = groups.get(p) || 0;
  groups.set(p, i + 1);
  el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(reveal);
}

/* --- Навигация и год --- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
$('#year').textContent = new Date().getFullYear();
