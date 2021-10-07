const db = require('../../database/models');

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

module.exports = {
    getActors: async (req, res) => {
        try {
            let actors = await db.Actor.findAll({
                order : [
                    ['first_name', 'ASC']
                ]
            })

            let response = {
                status: 200,
                meta: {
                    total: actors.length,
                    url: '/api/actors'
                },
                data: actors
            }
            return res.status(200).json(response)
        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/actors"
                },
                error: error.errors
            }
            return res.status(res.status || 500).json(response)
        }

    },
    detailActor: async (req, res) => {
        try {
            let actor = await db.Actor.findByPk(req.params.id)

            let response = {
                status: 200,
                meta: {
                    url: '/api/actors/' + req.params.id,
                },
                data: actor
            }
            return res.status(200).json(response)
        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/actors" + req.params.id
                },
                error: error.errors
            }
            return res.status(res.status || 500).json(response)
        }


    },
    createActor: async (req, res) => {
        try {
            const { first_name, last_name, rating, favorite_movie_id } = req.body;

            let actor = await db.Actor.create(
                {
                    first_name, last_name, rating, favorite_movie_id
                }
            )

            let response = {
                status: 201,
                meta: {
                    url: "/api/actors",
                    msg: "Actor cargado de forma exitosa."
                },
                data: actor
            }

            return res.status(201).json(response)

        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/actors"
                },
                error: error.errors.map(error => {
                    let item = {
                        field: error.path,
                        msg: error.message
                    }
                    return item
                })

            }
            return res.status(error.status || 500).json(response)
        }
    },
    updateActor: async (req, res) => {
        try {
            let actorId = req.params.id
            const { first_name, last_name, rating, favorite_movie_id } = req.body;

            let update = await db.Actor.update(
                {
                    first_name, last_name, rating, favorite_movie_id
                },
                {
                    where: { id: actorId }
                }
            )

            let actor = await db.Actor.findByPk(actorId)

            let response = {
                status: 200,
                meta: {
                    url: "/api/actors/" + actorId,
                    msg: "Actor modificado de forma exitosa."
                },
                data: actor
            }

            return res.status(200).json(response)

        } catch (error) {
            let actorId = req.params.id;
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/actors/" + actorId,
                },
                error: error.errors.map(error => {
                    let item = {
                        field: error.path,
                        msg: error.message
                    }
                    return item
                })
            }
            return res.status(error.status || 500).json(response)
        }
    },
    destroyActor: async (req, res) => {
        try {
            let actorId = req.params.id;

            let actor = await db.Actor.findByPk(actorId)

            let remove = await db.Actor.destroy({ where: { id: actorId }, force: true })

            let response = {
                status: 200,
                meta: {
                    url: "/api/actors/" + actorId,
                    msg: "Actor eliminado de forma exitosa."
                },
                data: actor
            }

            return res.status(200).json(response)

        } catch (error) {
            let actorId = req.params.id;
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/actors/" + actorId,
                },
                error: {
                        field: error.path,
                        msg: error.message
                    }
            }
            return res.status(error.status || 500).json(response)
        }
    }
}
