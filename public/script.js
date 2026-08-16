* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 40px;
}

/* Шапка и фильтры */
header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  gap: 16px;
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #38bdf8;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

input[type="text"], select {
  background-color: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

input[type="text"]:focus, select:focus {
  border-color: #38bdf8;
}

/* Баннер обратного отсчета */
#countdown-banner {
  margin: 20px 32px;
  padding: 12px 20px;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  border-radius: 8px;
  text-align: center;
  font-size: 1.05rem;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

/* Сетка карточек */
#container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  padding: 0 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.empty-msg {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.2rem;
  color: #94a3b8;
  padding: 40px 0;
}

/* Карточки */
.card {
  background-color: #1e293b;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

/* Оверлей карточки и изображения */
.card-img-wrap {
  position: relative;
  width: 100%;
  height: 330px;
  overflow: hidden;
  background-color: #0f172a;
}

.card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.94);
  color: #e2e8f0;
  padding: 16px;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover .card-overlay {
  opacity: 1;
}

.card-description {
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  overflow-y: auto;
  max-height: 220px;
}

/* Кнопки ссылок в оверлее */
.card-links {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
}

.link-btn {
  flex: 1;
  padding: 8px 0;
  text-align: center;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.1s;
}

.link-btn:active {
  transform: scale(0.97);
}

.imdb-btn {
  background: #f5c518;
  color: #000;
}

.imdb-btn:hover {
  background: #e2b616;
}

.trailer-btn {
  background: #ff0000;
  color: #fff;
}

.trailer-btn:hover {
  background: #cc0000;
}

/* Инфо-блок карточки */
.card-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  flex-grow: 1;
}

.card-info h3 {
  font-size: 0.95rem;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info p {
  font-size: 0.8rem;
  color: #94a3b8;
}

.fav-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.2s;
}

.fav-btn.active, .fav-btn:hover {
  color: #f59e0b;
}

/* Плашка соглашения */
#terms-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e293b;
  border-top: 1px solid #334155;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

#terms-banner.hidden {
  display: none;
}

#terms-banner a {
  color: #38bdf8;
}

#accept-terms {
  background-color: #0284c7;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

#accept-terms:hover {
  background-color: #0369a1;
}
// Отрисовка карточек-заглушек во время загрузки
function renderSkeletons(count = 8) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'skeleton-card';
    skel.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
    container.appendChild(skel);
  }
}

// Загрузка данных с вызовом скелетона
async function fetchMovies(query = 'Marvel', type = 'all', category = 'marvel') {
  try {
    renderSkeletons(8); // Показываем 8 мерцающих карточек перед получением ответа

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
