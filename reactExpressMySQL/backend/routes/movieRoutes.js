const express = require('express');
const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;