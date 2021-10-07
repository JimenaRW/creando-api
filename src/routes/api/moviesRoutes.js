const express = require('express');
const router = express.Router();
const {list, newMovies, recomended, detail, createMovie, editMovie, updateMovie, destroyMovie} = require('../../controllers/api/moviesController');

router
    .get('/', list)
    .get('/new', newMovies)
    .get('/recomended', recomended)
    .get('/:id', detail)
//Rutas exigidas para la creación del CRUD
    .post('/', createMovie)
    .get('/edit/:id', editMovie)
    .put('/:id', updateMovie)
    .delete('/:id', destroyMovie)

module.exports = router;