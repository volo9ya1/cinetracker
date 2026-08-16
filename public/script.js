// Инициализация OneSignal Web SDK
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "e92a5c5e-ddf4-4cd1-b88a-e7c3d11155f3",
  });
});

// Ключевые слова для фильтров киновселенных
const CATEGORY_QUERIES = {
  marvel: 'Marvel',
  dc: 'Batman',
  sts: 'Kitchen',
  tnt: 'Interns'
};

// Переводы интерфейса
const translations = {
  ru: {
    siteTitle: 'CineTracker',
    searchPlaceholder: 'Поиск...',
    allTypes: 'Все типы',
    typeMovie: 'Фильмы',
    typeSeries: 'Сериалы',
    allCategories: 'Все Вселенные',
    favoritesCategory: '⭐ Избранное',
    sortNewest: 'Новые первые',
    sortOldest: 'Старые первые',
    sortAlpha: 'По алфавиту',
    contactsTitle: 'Связаться с нами:',
    termsLink: 'Пользовательское соглашение',
    termsText: 'Используя данный сайт, вы соглашаетесь с <a href="terms.html" target="_blank">пользовательским соглашением</a>.',
    acceptBtn: 'Принять',
    notFound: 'Ничего не найдено.',
    countdownText: '⏳ Премьера «Avengers: Secret Wars»:'
  },
  en: {
    siteTitle: 'CineTracker',
    searchPlaceholder: 'Search...',
    allTypes: 'All types',
    typeMovie: 'Movies',
    typeSeries: 'Series',
    allCategories: 'All Universes',
    favoritesCategory: '⭐ Favorites',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortAlpha: 'Alphabetical',
    contactsTitle: 'Contact us:',
    termsLink: 'Terms of Service',
    termsText: 'By using this site, you agree to the <a href="terms.html" target="_blank">Terms of Service</a>.',
    acceptBtn: 'Accept',
    notFound: 'Nothing found.',
    countdownText: '⏳ "Avengers: Secret Wars" premiere in:'
  },
  uz: {
    siteTitle: 'CineTracker',
    searchPlaceholder: 'Qidiruv...',
    allTypes: 'Barcha turlar',
    typeMovie: 'Filmlar',
    typeSeries: 'Seriallar',
    allCategories: 'Barcha Olamlar',
    favoritesCategory: '⭐ Saralanganlar',
    sortNewest: 'Eng yangilar',
    sortOldest: 'Eng eski',
    sortAlpha: 'Alifbo bo‘yicha',
    contactsTitle: 'Biz bilan bog‘lanish:',
    termsLink: 'Foydalanish shartlari',
    termsText: 'Ushbu saytdan foydalanib, siz <a href="terms.html" target="_blank">foydalanish shartlariga</a> rozi bo‘lasiz.',
    acceptBtn: 'Qabul qilish',
    notFound: 'Hech narsa topilmadi.',
    countdownText: '⏳ "Avengers: Secret Wars" premerasiga:'
  }
};

let currentLang = 'ru';
let moviesData = [];

// Элементы DOM
const searchInput = document.getElementById('search');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const langSelect = document.getElementById('language');
const container = document.getElementById('container');
const countdownBanner = document.getElementById('countdown-banner');
const termsBanner = document.getElementById('terms-banner');
const acceptTermsBtn = document.getElementById('accept-terms');

// Таймер обратного отсчета
function startCountdown() {
  const targetDate = new Date('2027-05-07T00:00:00').getTime();
  
  setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (!countdownBanner) return;

    if (diff <= 0) {
      countdownBanner.textContent = 'Премьера состоялась!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const prefix = translations[currentLang].countdownText;
    countdownBanner.innerHTML = `${prefix} <strong>${days}д ${hours}ч ${minutes}м ${seconds}с</strong>`;
  }, 1000);
}

// Загрузка данных с сервера
async function fetchMovies(query = 'Marvel', type = 'all', category = 'marvel') {
  try {
    let url = `/api/movies?s=${encodeURIComponent(query)}`;
    if (type && type !== 'all') url += `&type=${type}`;
    if (category) url += `&category=${category}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      moviesData = data.items;
      applySortingAndRender();
    } else {
      moviesData = [];
      if (container) container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    if (container) container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
  }
}

// Корректная парсинг-сортировка дат и лет
function applySortingAndRender() {
  let sorted = [...moviesData];
  const sortValue = sortSelect ? sortSelect.value : 'newest';

  const parseYearOrDate = (dateStr) => {
    if (!dateStr) return 0;
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) return timestamp;
    const yearMatch = String(dateStr).match(/\d{4}/);
    return yearMatch ? parseInt(yearMatch[0], 10) : 0;
  };

  if (sortValue === 'newest') {
    sorted.sort((a, b) => parseYearOrDate(b.date) - parseYearOrDate(a.date));
  } else if (sortValue === 'oldest') {
    sorted.sort((a, b) => parseYearOrDate(a.date) - parseYearOrDate(b.date));
  } else if (sortValue === 'alpha') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderCards(sorted);
}

// Отрисовка карточек фильмов с оверлеем и кнопками
function renderCards(list) {
  if (!container) return;
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('fav_movies') || '[]');

  list.forEach(item => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.poster}" alt="${item.title}">
        <div class="card-overlay">
          <p class="card-description">${item.description || 'Описание отсутствует.'}</p>
          <div class="card-links">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="link-btn imdb-btn">IMDb</a>
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' трейлер')}" target="_blank" rel="noopener noreferrer" class="link-btn trailer-btn">Трейлер</a>
          </div>
        </div>
      </div>
      <div class="card-info">
        <h3>${item.title}</h3>
        <p>${item.date} | ${item.type} | ⭐ ${item.rating}</p>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
          ${isFav ? '★' : '☆'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Языковые переводы
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

// Обновление запроса по выбору параметров
function triggerFetch() {
  const cat = categorySelect ? categorySelect.value : 'marvel';
  const query = (searchInput && searchInput.value.trim()) || CATEGORY_QUERIES[cat] || 'Marvel';
  const type = typeSelect ? typeSelect.value : 'all';
  fetchMovies(query, type, cat);
}

// Отрисовка Избранного
function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem('fav_movies') || '[]');
  const favItems = moviesData.filter(m => favorites.includes(m.id));
  renderCards(favItems);
}

// Обработчики событий
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 2) {
      const typeVal = typeSelect ? typeSelect.value : 'all';
      const catVal = categorySelect ? categorySelect.value : 'marvel';
      fetchMovies(val, typeVal, catVal);
    }
  });
}

if (typeSelect) {
  typeSelect.addEventListener('change', triggerFetch);
}

if (categorySelect) {
  categorySelect.addEventListener('change', (e) => {
    if (e.target.value === 'favorites') {
      renderFavorites();
    } else {
      triggerFetch();
    }
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', applySortingAndRender);
}

if (container) {
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('fav-btn')) {
      const id = e.target.getAttribute('data-id');
      let favorites = JSON.parse(localStorage.getItem('fav_movies') || '[]');
      
      if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
      } else {
        favorites.push(id);
      }
      
      localStorage.setItem('fav_movies', JSON.stringify(favorites));
      
      if (categorySelect && categorySelect.value === 'favorites') {
        renderFavorites();
      } else {
        applySortingAndRender();
      }
    }
  });
}

// Соглашение о конфиденциальности
if (termsBanner && !localStorage.getItem('terms_accepted')) {
  termsBanner.classList.remove('hidden');
}

if (acceptTermsBtn) {
  acceptTermsBtn.addEventListener('click', () => {
    localStorage.setItem('terms_accepted', 'true');
    if (termsBanner) termsBanner.classList.add('hidden');
  });
}

if (langSelect) {
  langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
}

// Стартовый вызов
startCountdown();
fetchMovies('Marvel', 'all', 'marvel');
