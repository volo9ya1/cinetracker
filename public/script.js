// Инициализация OneSignal
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "e92a5c5e-ddf4-4cd1-b88a-e7c3d11155f3",
  });
});

// Ключевые запросы для вселенных
const CATEGORY_QUERIES = {
  marvel: 'Avengers',
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

// DOM Элементы
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

// Запрос к бэкенду Render
async function fetchMovies(query = 'Avengers', type = 'all') {
  try {
    let url = `/api/movies?s=${encodeURIComponent(query)}`;
    if (type !== 'all') url += `&type=${type}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === 'True') {
      moviesData = data.Search;
      renderCards(moviesData);
    } else {
      moviesData = [];
      container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
  }
}

// Отрисовка карточек
function renderCards(list) {
  container.innerHTML = '';
  if (!list || list.length === 0) {
    container.innerHTML = `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('fav_movies') || '[]');

  list.forEach(item => {
    const isFav = favorites.includes(item.imdbID);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.Poster !== 'N/A' ? item.Poster : 'avatar.png'}" alt="${item.Title}">
      <div class="card-info">
        <h3>${item.Title}</h3>
        <p>${item.Year} | ${item.Type}</p>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.imdbID}">
          ${isFav ? '★' : '☆'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Переключение языка
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.innerHTML = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });
}

// Обработчики событий
searchInput.addEventListener('input', (e) => {
  const val = e.target.value.trim();
  if (val.length > 2) fetchMovies(val, typeSelect.value);
});

typeSelect.addEventListener('change', () => {
  const query = searchInput.value.trim() || CATEGORY_QUERIES[categorySelect.value] || 'Avengers';
  fetchMovies(query, typeSelect.value);
});

categorySelect.addEventListener('change', (e) => {
  const cat = e.target.value;
  if (cat === 'favorites') {
    // Отображение сохраненных фильмов
    const favorites = JSON.parse(localStorage.getItem('fav_movies') || '[]');
    container.innerHTML = favorites.length ? '' : `<p class="empty-msg">${translations[currentLang].notFound}</p>`;
  } else if (CATEGORY_QUERIES[cat]) {
    fetchMovies(CATEGORY_QUERIES[cat], typeSelect.value);
  } else {
    fetchMovies('Avengers', typeSelect.value);
  }
});

// Добавление в избранное
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
    renderCards(moviesData);
  }
});

// Соглашение
if (!localStorage.getItem('terms_accepted')) {
  termsBanner.classList.remove('hidden');
}

acceptTermsBtn.addEventListener('click', () => {
  localStorage.setItem('terms_accepted', 'true');
  termsBanner.classList.add('hidden');
});

langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

// Инициализация при старте
startCountdown();
fetchMovies('Avengers');
