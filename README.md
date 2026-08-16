# CineTracker 🎬

**CineTracker** — веб-приложение (PWA) для поиска и отслеживания фильмов и сериалов по киновселенным с поддержкой OMDb API и Push-уведомлений.

## 🚀 Основные возможности

* **Поиск и фильтрация:** Поиск контента и быстрая фильтрация по киновселенным (Marvel, DC, СТС, ТНТ).
* **Избранное:** Сохранение понравившихся фильмов и сериалов в `localStorage`.
* **Мультиязычность:** Полная поддержка русского, английского и узбекского языков.
* **Push-уведомления:** Интеграция с OneSignal Web SDK.
* **PWA (Progressive Web App):** Возможность установки приложения на телефон и ПК.
* **Обратный отсчет:** Динамический таймер до премьеры фильма «Avengers: Secret Wars».

## 🛠️ Технологический стек

* **Backend:** Node.js, Express
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **API:** OMDb API, OneSignal Web SDK
* **Хостинг:** Render

## 🔑 Переменные окружения (Environment Variables)

Для работы приложения необходимо настроить следующие переменные на Render или в `.env` файле:

* `OMDB_API_KEY` — 8-значный ключ с [OMDb API](https://www.omdbapi.com/apikey.aspx).
* `PORT` — Порт сервера (по умолчанию `10000` на Render или `3000` локально).

## 📦 Локальная установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone [https://github.com/volo9ya1/cinetracker.git](https://github.com/volo9ya1/cinetracker.git)
   cd cinetracker
