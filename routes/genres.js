const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// Mensaje 
const GENERO_NO_EXISTE = 'No existe ningún genéro cinematográfico con el ID brindado.';

// Se importa el modelo del género cinematográfico y el método de validación de los datos ingresados 
const {Genre, validate} = require('../models/genre');

// Endpoint para método GET de HTTP (lista a todos los géneros cinematográficos) 
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// Endpoint para método POST de HTTP (agrega un género cinematográfico)
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

// Endpoint para método PUT de HTTP (actualiza los datos del género cinematográfico cuyo ID se indique)
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);  
  
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send(GENERO_NO_EXISTE);
  
  res.send(genre);
});

// Endpoint para método DELETE de HTTP (remueve al género cinematográfico cuyo ID se indique)
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send(GENERO_NO_EXISTE);

  res.send(genre);
});

// Endpoint para método GET de HTTP (lista a un solo género cinematográfico, determinado por el ID que se indique)
router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send(GENERO_NO_EXISTE);

  res.send(genre);
});

// Se disponibiliza la ruta de géneros cinematográficos 
module.exports = router;