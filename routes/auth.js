const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// Se importa el modelo del usuario 
const {User} = require('../models/user');

// Mensaje
const EMAIL_PASS_INVALIDOS = "Email o contraseña inválidos."

// Endpoint para método POST de HTTP (auntentica un usuario)
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(EMAIL_PASS_INVALIDOS);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send(EMAIL_PASS_INVALIDOS);

  const token = user.generateAuthToken();
  res.send(token);
});

// Método para validar los datos del usuario que se ingresa (solo email y contraseña)
function validate(req) {
  const validSchema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return validSchema.validate({ email: req.email, password: req.password });
}

module.exports = router; 
