const express = require('express');
const roteador = express.Router();
const ControladorAutenticacao = require('../controllers/ControladorAutenticacao');

// Rotas públicas
roteador.post('/login', ControladorAutenticacao.login);
roteador.post('/registrar', ControladorAutenticacao.registrar);
roteador.get('/verificar', ControladorAutenticacao.verificarToken);

module.exports = roteador;

