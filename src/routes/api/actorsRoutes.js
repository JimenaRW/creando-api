const express = require('express');
const router = express.Router();
const { getActors, detailActor, createActor, updateActor, destroyActor } = require('../../controllers/api/actorsController');


/* /api/actors */
router
    .get('/', getActors)
    .get('/:id', detailActor)
//Rutas exigidas para la creación del CRUD
    .post('/', createActor)
    .put('/:id', updateActor)
    .delete('/:id', destroyActor)

module.exports = router;