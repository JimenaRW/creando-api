const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: async (req, res) => {
        try {
            let movies = await Movies.findAll({
                include: ['genre']
            })

            let response = {
                status: 200,
                meta: {
                    total: movies.length,
                    url: '/api/movies'
                },
                data: movies
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(res.status || 500).json(error)
        }


    },
    consultaOmdb : async (req,res) => {
        try {
            let apiKey = '4cc5bdfa';
            const {search} = req.body;

            let moviesOmdb = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${search}`)

            let response = {
                status: 200,
                meta: {
                    total: movies.length,
                    url: '/api/movies'
                },
                data: moviesOmdb
            }
            return res.status(200).json(response)
        } catch(err) {
            return res.status(error.status || 500).json(error)
        }
    },
    detail: async (req, res) => {
        try {
            let movie = await db.Movie.findByPk(req.params.id,
                {
                    include: ['genre']
                })

            let response = {
                status: 200,
                meta: {
                    url: '/api/movies/' + req.params.id,
                },
                data: movie
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(res.status || 500).json(error)
        }


    },
    newMovies: async (req, res) => {
        try {
            let movies = await Movies.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: 5
            })
            let response = {
                status: 200,
                meta: {
                    total: movies.length,
                    url: '/api/movies/new'
                },
                data: movies
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(res.status || 500).json(error)
        }
    },
    'recomended': async (req, res) => {
        try {
            let movies = await db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: { [db.Sequelize.Op.gte]: 8 }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            let response = {
                status: 200,
                meta: {
                    total: movies.length,
                    url: '/api/movies/recomended'
                },
                data: movies
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(res.status || 500).json(error)
        }
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    
    createMovie: async (req, res) => {
        try {
            const { title, rating, awards, release_date, length, genre_id } = req.body;
            let movie = await db.Movie
                .create({ title, rating, awards, release_date, length, genre_id })
            let response = {
                status: 201,
                meta: {
                    url: '/api/movies/add',
                    msg: "La película fue cargada con exito"
                },
                data: movie
            }
            return res.status(201).json(response)

        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: { url: '/api/movies/add' },
                errors: error.errors.map(error => {
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
    editMovie: async (req, res) => {
        try {
            let movieId = req.params.id;
            let promMovies = await Movies.findByPk(movieId, { include: ['genre', 'actors'] });
            let promGenres = await Genres.findAll();
            let promActors = await Actors.findAll();

            let response = {
                status: 201,
                meta: {
                    url: '/api/movies/edit/' + req.params.id
                },
                data: { promMovies, promGenres, promActors }
            }
            return res.status(201).json(response)

        } catch (error) {
            return res.status(res.status || 500).json(error)
        }

    },
    updateMovie: async (req, res) => {
        try {
            let movieId = req.params.id;
            let update = await Movies
                .update(
                    {
                        title: req.body.title,
                        rating: req.body.rating,
                        awards: req.body.awards,
                        release_date: req.body.release_date,
                        length: req.body.length,
                        genre_id: req.body.genre_id
                    },
                    {
                        where: { id: movieId }
                    })
            let movie = await Movies.findByPk(movieId, { include: ['genre', 'actors'] });
            let response = {
                status: 201,
                meta: {
                    url: '/api/movies/' + req.params.id,
                    msg: "La película fue editada con exito."
                },
                data: movie
            }
            return res.status(201).json(response)

        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: '/api/movies/' + req.params.id
                },
                errors: error.errors.map(error => {
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
    
    destroyMovie: async (req, res) => {
        try {
            let movieId = req.params.id;
            let movieDelete = await Movies
                .findByPk(movieId,
                    {
                        include: ['genre', 'actors']
                    })
            let destroy = await Movies
                .destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            let response = {
                status: 200,
                meta: {
                    url: '/api/movies/' + req.params.id,
                    msg : "Película eliminada con exito."
                },
                data : movieDelete
            }
            return res.status(200).json(response)

        } catch (error) {
            let response = {
                status: error.status || 500,
                meta: {
                    url: '/api/movies/' + req.params.id,
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
module.exports = moviesController;