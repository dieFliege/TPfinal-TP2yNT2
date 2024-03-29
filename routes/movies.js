const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

/** 
 * Se importan los modelos de la película y del género cinematográfico 
 * Para la película se importa además el método de validación de los datos ingresados 
 */ 
const {Movie, validate} = require('../models/movie'); 
const {Genre} = require('../models/genre');

// Mensajes 
const GENERO_INVALIDO = 'Género cinematográfico inválido.';
const PELICULA_NO_EXISTE = 'No existe ninguna película con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todas las películas) 
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// Endpoint para método POST de HTTP (agrega una película)
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(GENERO_INVALIDO);

  const movie = new Movie({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    plot: req.body.plot,
    year: req.body.year,
    rated: req.body.rated,
    actors: req.body.actors,
    awards: req.body.awards,
    poster: req.body.poster,
    writer: req.body.writer,
    imdbID: req.body.imdbID,
    country: req.body.country,
    runtime: req.body.runtime,
    director: req.body.director,
    language: req.body.language,
    released: req.body.released,
    metascore: req.body.metascore,
    imdbVotes: req.body.imdbVotes,
    imdbRating: req.body.imdbRating
  });
  await movie.save();
  
  res.send(movie);
});

// Endpoint para método PUT de HTTP (actualiza los datos de la película cuyo ID se indique)
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(GENERO_INVALIDO);

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      plot: req.body.plot,
      year: req.body.year,
      rated: req.body.rated,
      actors: req.body.actors,
      awards: req.body.awards,
      poster: req.body.poster,
      writer: req.body.writer,
      imdbID: req.body.imdbID,
      country: req.body.country,
      runtime: req.body.runtime,
      director: req.body.director,
      language: req.body.language,
      released: req.body.released,
      metascore: req.body.metascore,
      imdbVotes: req.body.imdbVotes,
      imdbRating: req.body.imdbRating
    }, { new: true });

  if (!movie) return res.status(404).send(PELICULA_NO_EXISTE);
  
  res.send(movie);
});

// Endpoint para método DELETE de HTTP (remueve a la película cuyo ID se indique)
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send(PELICULA_NO_EXISTE);

  res.send(movie);
});

// Endpoint para método GET de HTTP (lista a una sola película, determinada por el ID que se indique)
router.get('/:id', validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send(PELICULA_NO_EXISTE);

  res.send(movie);
});

// Se disponibiliza la ruta de películas  
module.exports = router; 