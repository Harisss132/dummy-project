const pool = require('../config/db');

//GETALLMOVIES
exports.getAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const [movies] = await pool.query('SELECT * FROM movies ORDER BY createdAt DESC LIMIT ? OFFSET ?', [limit, offset]);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM movies');

    res.json({
      data: movies,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
    if (movies.length === 0) {
      return res.status(404).json({ msg: ' Movie not found' });
    }
    res.json(movies[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
};

exports.createMovie = async (req, res) => {
  const { title, director, year, genre, rating } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO movies(title, director, year, genre, rating) VALUES (?, ?, ?, ?, ?)', [title, director, year, genre, rating]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, year, genre, rating } = req.body;
    const [result] = await pool.query('UPDATE movies SET title = ?, director = ?, year =? , genre = ?, rating = ? WHERE id = ?', [title, director, year, genre, rating, id]);
    res.json({ msg: 'Movie Update Success' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM movies WHERE id = ?', [id]);
    res.json({ msg: 'Movie delete success' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};
