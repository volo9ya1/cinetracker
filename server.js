const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Замените на ваш бесплатный ключ с omdbapi.com
const OMDB_API_KEY = 'P4P824V-QXF409N-J5CMCYF-ST8RM2A';

app.use(express.static('public'));

app.get('/api/movies', async (req, res) => {
  const { category, search, type } = req.query;

  try {
    let query = search || 'Marvel';
    if (!search && category && category !== 'all' && category !== 'favorites') {
      query = category;
    }

    const typeParam = (type && type !== 'all') ? `&type=${type}` : '';
    const searchUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}${typeParam}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.Response === 'False') {
      return res.json({ items: [] });
    }

    // Запрашиваем подробную информацию по каждому найденному объекту
    const items = await Promise.all(
      searchData.Search.slice(0, 10).map(async (item) => {
        const detailUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${item.imdbID}&plot=full`;
        const detailRes = await fetch(detailUrl);
        const detail = await detailRes.json();

        return {
          id: detail.imdbID,
          title: detail.Title,
          category: category || 'marvel',
          type: detail.Type === 'series' ? 'series' : 'movie',
          source: detail.Type === 'series' ? 'TV Series' : 'Movie',
          date: detail.Released !== 'N/A' ? detail.Released : detail.Year,
          rating: detail.imdbRating !== 'N/A' ? detail.imdbRating : '7.5',
          poster: detail.Poster !== 'N/A' ? detail.Poster : 'https://via.placeholder.com/300x450',
          trailer: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(detail.Title + ' trailer')}`,
          description: detail.Plot !== 'N/A' ? detail.Plot : 'Описание отсутствует.',
          audio: ['ru', 'en'],
          url: `https://www.imdb.com/title/${detail.imdbID}`
        };
      })
    );

    res.json({ items });
  } catch (error) {
    console.error('OMDb API Error:', error);
    res.status(500).json({ error: 'Ошибка сервера при загрузке данных' });
  }
});

app.listen(PORT, () => {
  console.log(`CineTracker запущен на http://localhost:${PORT}`);
});
