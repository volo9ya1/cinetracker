// OneSignal Push Notification Initialisation
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "YOUR_ONESIGNAL_APP_ID",
  });
});

// Переводы (i18n)
const translations = {
  ru: {
    siteTitle: "CineTracker",
    searchPlaceholder: "Поиск...",
    allTypes: "Все типы",
    typeMovie: "Фильмы",
    typeSeries: "Сериалы",
    allCategories: "Все Вселенные",
    favoritesCategory: "⭐ Избранное",
    sortNewest: "Новые первые",
    sortOldest: "Старые первые",
    sortAlpha: "По алфавиту",
    contactsTitle: "Связаться с нами:",
    termsLink: "Пользовательское соглашение",
    termsText: "Используя данный сайт, вы соглашаетесь с пользовательским соглашением.",
    acceptBtn: "Принять",
    share: "🔗 Поделиться",
    trailersSection: "Трейлеры / Тизеры",
    notFound: "Ничего не найдено.",
    serverError: "Ошибка при загрузке данных с сервера."
  },
  en: {
    siteTitle: "CineTracker",
    searchPlaceholder: "Search...",
    allTypes: "All types",
    typeMovie: "Movies",
    typeSeries: "TV Series",
    allCategories: "All Universes",
    favoritesCategory: "⭐ Favorites",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    sortAlpha: "Alphabetical",
    contactsTitle: "Contact us:",
    termsLink: "Terms of Service",
    termsText: "By using this website, you agree to the Terms of Service.",
    acceptBtn: "Accept",
    share: "🔗 Share",
    trailersSection: "Trailers / Teasers",
    notFound: "Nothing found.",
    serverError: "Error loading data from server."
  },
  uz: {
    siteTitle: "CineTracker",
    searchPlaceholder: "Qidiruv...",
    allTypes: "Barcha turlar",
    typeMovie: "Filmlar",
    typeSeries: "Seriallar",
    allCategories: "Barcha koinotlar",
    favoritesCategory: "⭐ Sevimlilar",
    sortNewest: "Yangi birinchi",
    sortOldest: "Eski birinchi",
    sortAlpha: "Alifbo bo'yicha",
    contactsTitle: "Biz bilan bog'lanish:",
    termsLink: "Foydalanuvchi shartnomasi",
    termsText: "Ushbu saytdan foydalanib, siz foydalanuvchi shartnomasiga rozi bo'lasiz.",
    acceptBtn: "Qabul qilish",
    share: "🔗 Ulashish",
    trailersSection: "Treylerlar / Tizerlar",
    notFound: "Hech narsa topilmadi.",
    serverError: "Serverdan ma'lumotlarni yuklashda xatolik."
  }
};

let currentLang = 'ru';
let favorites = JSON.parse(localStorage.getItem('cinetracker_favorites') || '[]');

// DOM элементы
const searchInput = document.getElementById('search');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const languageSelect = document.getElementById('language');
const container = document.getElementById('container');
const termsBanner = document.getElementById('terms-banner');
const acceptTermsBtn = document.getElementById('accept-terms');

// Проверка соглашения (localStorage)
if (!localStorage.getItem('cinetracker_terms_accepted')) {
  termsBanner.classList.remove('hidden');
}

acceptTermsBtn.addEventListener('click', () => {
  localStorage.setItem('cinetracker_terms_accepted', 'true');
  termsBanner.classList.add('hidden');
});

// Переключение языка
languageSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  applyLanguage(currentLang);
  render();
});

function applyLanguage(lang) {
  const dict = translations[lang] || translations.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });
}

// Избранное
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('cinetracker_favorites', JSON.stringify(favorites));
  render();
}

// Web Share API
async function shareContent(title, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url: url || window.location.href });
    } catch (e) {}
  } else {
    navigator.clipboard.writeText(url || window.location.href);
    alert('Ссылка скопирована!');
  }
}

// Обратный отсчет
function initCountdown(targetDateStr, title) {
  const banner = document.getElementById('countdown-banner');
  const targetDate = new Date(targetDateStr).getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      banner.innerHTML = `🎉 Премьера: ${title}`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    banner.innerHTML = `⏳ Премьера «${title}»: ${days}д ${hours}ч ${minutes}м ${seconds}с`;
  }, 1000);
}

// Отрисовка каталога
async function render() {
  const dict = translations[currentLang] || translations.ru;

  const params = new URLSearchParams({
    category: categorySelect.value,
    search: searchInput.value.trim(),
    type: typeSelect.value,
    sort: sortSelect.value
  });

  try {
    const res = await fetch(`/api/movies?${params}`);
    const data = await res.json();
    let items = data.items || [];

    if (categorySelect.value === 'favorites') {
      items = items.filter(item => favorites.includes(item.id));
    }

    if (!items.length) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">${dict.notFound}</p>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const isFav = favorites.includes(item.id);

      return `
        <div class="card">
          <div class="card-top">
            <img src="${item.poster}" alt="${item.title}" class="poster">
            <div class="card-info">
              <div class="card-title-row">
                <strong>${item.title}</strong>
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.id}')">★</button>
              </div>
              <div class="meta">${item.date}</div>
              <div class="rating">★ ${item.rating}</div>
              <p class="meta" style="margin-top: 5px;">${item.description.slice(0, 90)}...</p>
              <button class="share-btn" onclick="shareContent('${item.title}', '${item.url}')">${dict.share}</button>
            </div>
          </div>
          <div class="card-middle">
            <div class="meta" style="margin-bottom: 5px;">${dict.trailersSection}:</div>
            <div class="trailer-box">
              <iframe src="${item.trailer}" allowfullscreen loading="lazy"></iframe>
            </div>
          </div>
          <div class="card-bottom">
            <span class="badge">${item.source}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--accent-color); padding: 40px 0;">${dict.serverError}</p>`;
  }
}

// Слушатели событий
searchInput.addEventListener('input', render);
typeSelect.addEventListener('change', render);
categorySelect.addEventListener('change', render);
sortSelect.addEventListener('change', render);

// Инициализация
initCountdown('2027-05-07', 'Avengers: Secret Wars');
render();