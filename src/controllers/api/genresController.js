const db = require('../../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': async (req, res) => {
        try {
            let genres = await db.Genre.findAll()

            let response = {
                meta : {
                    status : 200,
                    total : genres.length,
                    url : `/api/genres`
                },
                data : genres

            }
            return res.status(200).json(response)
        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/genres"
                },
                error: error.errors
            }
            return res.status(res.status || 500).json(response)
        }
    },
    'detail': async (req, res) => {
        try {
            let genre = await db.Genre.findByPk(req.params.id)

            let response = {
                meta : {
                    status : 200,
                    url : '/api/genres/' + req.params.id
                },
                data : genre

            }
            return res.status(200).json(response)

        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: "/api/genres/" + req.params.id
                },
                error: error.errors
            }
            return res.status(res.status || 500).json(response)
        }
    },
    // CRUD genres
    createGenre : async (req,res) => {
        try {
            let { name, ranking, active } = req.body;
            let genre = await db.Genre.create(
                {
                    name, ranking, active
                }
            )
            let response = {
                status : 201,
                meta : {
                    url : "/api/genres",
                    msg : "Género creado con exito"
                },
                data : genre
            }
            return res.status(201).json(response)
        } catch (error) {
            let response = {
                status : error.status || 500,
                meta : {
                    url : "/api/genres"
                },
                error : error.errors.map( error => {
                    let item = {
                        field : error.path,
                        msg : error.message
                    }
                    return item
                })
            }
            return res.status(error.status || 500).json(response)
        }
    },
    updateGenre : async (req,res) => {
        try {
            let genreId = req.params.id    
            let { name, ranking, active } = req.body; 
            let update = await db.Genre.update(
                {
                    name, ranking, active
                },
                {
                    where : {
                        id : genreId
                    }
                }
            )
                let genre = await db.Genre.findByPk(genreId)
            let response = {
                status : 200,
                meta : {
                    url : "/api/genres/" + genreId,
                    msg : "Género editado con exito"
                },
                data : genre
            }
            return res.status(200).json(response)
        } catch (error) {
            let genreId = req.params.id;
            let response = {
                status : error.status || 500,
                meta : {
                    url : "/api/genres/" + genreId
                },
                error : error.errors.map(error => {
                    let item = {
                        field : error.path,
                        msg : error.message
                    }
                    return item
                })
            }
            return res.status(error.status || 500).json(response)
        }
    },
    destroyGenre : async (req,res) => {
        try {
            let genreId = req.params.id;
            let genre = await db.Genre.findByPk(genreId)

            let remove = await db.Genre.destroy(
                {
                    where : {
                        id : genreId
                    },
                    force : true
                }
            )

            let response = {
                status : 200,
                meta : {
                    url : "/api/genres/" + genreId,
                    msg : "Género eliminado con éxito."
                },
                data : genre
            }
            return res.status(200).json(response)

        } catch (error) {
            let genreId = req.params.id;
            let response = {
                status : error.status || 500,
                meta : {
                    url : "/api/genres/" + genreId
                },
                error : error.errors
            }
            return res.status(error.status || 500).json(response)
            
        }
    }

}

module.exports = genresController;