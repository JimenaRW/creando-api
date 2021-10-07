const express = require('express');
const router = express.Router();
const { list, detail, updateGenre, createGenre, destroyGenre } = require('../../controllers/api/genresController');

/* /api/genres */
router
.get('/', list)
.get('/:id', detail)
// CRUD genre
.post('/', createGenre)
.put('/:id', updateGenre)
.delete('/:id', destroyGenre)


module.exports = router;